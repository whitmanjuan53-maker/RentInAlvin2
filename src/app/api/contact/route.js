import { Resend } from 'resend';
import { saveUnifiedLead, logEmail, attachEmailToLead, recordEvent, normalizeLeadType, hashIp } from '@/lib/analytics';

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    const {
      formType,
      type,
      name,
      firstName,
      lastName,
      phone,
      email,
      property,
      moveInDate,
      moveBy,
      bedrooms,
      tourDate,
      tourTime,
      message,
      notes,
      pageUrl,
      website,
      // Apply form fields
      dob,
      currentAddress,
      coApplicants,
      pets,
      petDesc,
      vehicles,
      employer,
      jobTitle,
      income,
      employedSince,
      prevLandlord,
      prevLandlordPhone,
      reasonLeaving,
      unitType,
      budget,
      consent,
      // Sell form fields
      addr,
      beds,
      baths,
      sqft,
      timeline,
    } = body;

    // Honeypot spam check
    if (website) {
      return Response.json({ error: 'Spam detected' }, { status: 400 });
    }

    // Determine form type and build content
    const actualFormType = formType || type || 'Contact';
    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim();
    
    // Build email subject
    const subject = `New ${actualFormType === 'apply' ? 'Application' : actualFormType === 'sell' ? 'Sell Inquiry' : actualFormType} - ${fullName || 'Website Submission'}`;

    // Build HTML content
    let htmlContent = `<h2>New Submission from RentInAlvin Website</h2>`;
    htmlContent += `<p><strong>Form Type:</strong> ${actualFormType}</p>`;
    htmlContent += `<p><strong>Name:</strong> ${fullName || 'N/A'}</p>`;
    htmlContent += `<p><strong>Phone:</strong> ${phone || 'N/A'}</p>`;
    htmlContent += `<p><strong>Email:</strong> ${email || 'N/A'}</p>`;
    
    if (property || addr) htmlContent += `<p><strong>Property/Address:</strong> ${property || addr || 'N/A'}</p>`;
    if (moveInDate || moveBy) htmlContent += `<p><strong>Move-in Timeframe:</strong> ${moveInDate || moveBy || 'N/A'}</p>`;
    if (bedrooms) htmlContent += `<p><strong>Bedroom Needs:</strong> ${bedrooms}</p>`;
    if (tourDate) htmlContent += `<p><strong>Tour Date:</strong> ${tourDate}</p>`;
    if (tourTime) htmlContent += `<p><strong>Tour Time:</strong> ${tourTime}</p>`;
    if (unitType) htmlContent += `<p><strong>Unit Type:</strong> ${unitType}</p>`;
    if (budget) htmlContent += `<p><strong>Budget:</strong> $${budget}</p>`;
    
    // Apply form specific fields
    if (actualFormType === 'apply') {
      if (dob) htmlContent += `<p><strong>Date of Birth:</strong> ${dob}</p>`;
      if (currentAddress) htmlContent += `<p><strong>Current Address:</strong> ${currentAddress}</p>`;
      if (coApplicants) htmlContent += `<p><strong>Co-applicants:</strong> ${coApplicants}</p>`;
      if (pets) htmlContent += `<p><strong>Pets:</strong> ${pets === 'no' ? 'None' : petDesc || pets}</p>`;
      if (vehicles) htmlContent += `<p><strong>Vehicles:</strong> ${vehicles}</p>`;
      if (employer) htmlContent += `<p><strong>Employer:</strong> ${employer}</p>`;
      if (jobTitle) htmlContent += `<p><strong>Job Title:</strong> ${jobTitle}</p>`;
      if (income) htmlContent += `<p><strong>Monthly Income:</strong> $${income}</p>`;
      if (employedSince) htmlContent += `<p><strong>Employed Since:</strong> ${employedSince}</p>`;
      if (prevLandlord) htmlContent += `<p><strong>Previous Landlord:</strong> ${prevLandlord}</p>`;
      if (prevLandlordPhone) htmlContent += `<p><strong>Landlord Phone:</strong> ${prevLandlordPhone}</p>`;
      if (reasonLeaving) htmlContent += `<p><strong>Reason for Leaving:</strong> ${reasonLeaving}</p>`;
      if (consent !== undefined) htmlContent += `<p><strong>Consent:</strong> ${consent ? 'Yes' : 'No'}</p>`;
    }
    
    // Sell form specific fields
    if (actualFormType === 'sell') {
      if (type && type !== 'sell') htmlContent += `<p><strong>Property Type:</strong> ${type}</p>`;
      if (beds) htmlContent += `<p><strong>Beds:</strong> ${beds}</p>`;
      if (baths) htmlContent += `<p><strong>Baths:</strong> ${baths}</p>`;
      if (sqft) htmlContent += `<p><strong>Sq Ft:</strong> ${sqft}</p>`;
      if (timeline) htmlContent += `<p><strong>Timeline:</strong> ${timeline}</p>`;
    }
    
    if (message || notes) htmlContent += `<p><strong>Message/Notes:</strong> ${message || notes || 'N/A'}</p>`;
    htmlContent += `<p><strong>Page Source:</strong> ${pageUrl || 'N/A'}</p>`;
    htmlContent += `<p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>`;

    // Store the lead first so it is captured even if the email fails
    const leadType = normalizeLeadType(actualFormType);
    const leadRowId = await saveUnifiedLead({
      rawType: actualFormType,
      leadType,
      name: fullName || 'Unknown',
      email,
      phone,
      property: property || addr,
      message: message || notes,
      metadata: {
        moveInDate: moveInDate || moveBy,
        bedrooms,
        tourDate,
        tourTime,
        unitType,
        budget,
        income: income ? 'provided' : undefined,
      },
      sourcePage: pageUrl || req.headers.get('referer') || null,
    });

    await recordEvent({
      eventType: leadType === 'booking' ? 'booking_submit' : 'form_submit',
      pagePath: (() => { try { return pageUrl ? new URL(pageUrl).pathname : null; } catch { return pageUrl || null; } })(),
      ipHash: hashIp(getClientIp(req)),
      metadata: { leadType, leadRowId },
    });

    const toEmail = process.env.EMAIL_TO || 'office@yellowstone-am.com';
    const ccList = (process.env.EMAIL_CC || '').split(',').map((e) => e.trim()).filter(Boolean);
    const emailType = leadType === 'booking' ? 'booking_notification' : 'lead_notification';

    let data = null;
    let error = null;
    try {
      ({ data, error } = await getResend().emails.send({
        from: process.env.EMAIL_FROM,
        to: [toEmail],
        cc: ccList.length > 0 ? ccList : undefined,
        replyTo: email,
        subject: subject,
        html: htmlContent,
      }));
    } catch (sendErr) {
      error = sendErr;
    }

    if (error) {
      console.error('Resend error:', error);
      await logEmail({
        leadId: leadRowId,
        emailType,
        toEmail,
        subject,
        status: 'failed',
        errorMessage: error.message || String(error),
      });
      await recordEvent({ eventType: 'email_failed', metadata: { emailType, leadId: leadRowId } });
      // The lead is already saved; only fail the request if it was not stored at all
      if (!leadRowId) {
        return Response.json({ error: 'Failed to send email' }, { status: 500 });
      }
    } else {
      await logEmail({
        resendEmailId: data?.id || null,
        leadId: leadRowId,
        emailType,
        toEmail,
        subject,
        status: 'sent',
      });
      if (leadRowId && data?.id) await attachEmailToLead(leadRowId, data.id);
      await recordEvent({ eventType: 'email_sent', metadata: { emailType, leadId: leadRowId, resendEmailId: data?.id } });
    }

    // Determine success message
    let successMessage;
    if (actualFormType === 'Tour Booking') {
      successMessage = 'Thank you. Your tour request has been received. A member of the leasing team will contact you shortly to confirm availability.';
    } else if (actualFormType === 'apply') {
      successMessage = 'Application received. A confirmation will be sent to your email within an hour, and someone from the leasing office will follow up by phone within one business day.';
    } else {
      successMessage = 'Thank you. Your request has been received. A member of the leasing team will contact you shortly.';
    }

    return Response.json({
      success: true,
      messageId: data?.id || null,
      leadId: leadRowId,
      message: successMessage
    });

  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}