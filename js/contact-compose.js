(function() {
  const CONTACT = {
    email: 'kylemathias@gmail.com',
    defaultSubject: "Let's connect!"
  };

  function getField(id) {
    const field = document.getElementById(id);
    return field ? field.value.trim() : '';
  }

  function buildBody(name, message) {
    return 'Hi Kyle,\n\n' + message + '\n\n— ' + name;
  }

  function buildMailtoUrl(email, subject, body) {
    return 'mailto:' + email +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  function buildGmailUrl(email, subject, body) {
    const params = new URLSearchParams();
    params.set('view', 'cm');
    params.set('fs', '1');
    params.set('to', email);
    params.set('su', subject);
    params.set('body', body);
    return 'https://mail.google.com/mail/?' + params.toString();
  }

  function buildOutlookUrl(email, subject, body) {
    const params = new URLSearchParams();
    params.set('to', email);
    params.set('subject', subject);
    params.set('body', body);
    return 'https://outlook.live.com/mail/deeplink/compose?' + params.toString();
  }

  function showError(message) {
    const errorEl = document.getElementById('composeError');
    if (!errorEl) {
      return;
    }

    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    const errorEl = document.getElementById('composeError');
    if (!errorEl) {
      return;
    }

    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  function validateFields() {
    const name = getField('contactName');
    const subject = getField('contactSubject');
    const message = getField('contactMessage');

    if (!name || !subject || !message) {
      showError('Please fill in your name, subject, and message before opening your email app.');
      return null;
    }

    clearError();
    return {
      name: name,
      subject: subject,
      message: message,
      body: buildBody(name, message)
    };
  }

  function openCompose(provider) {
    const fields = validateFields();
    if (!fields) {
      return;
    }

    let url = '';

    if (provider === 'default') {
      url = buildMailtoUrl(CONTACT.email, fields.subject, fields.body);
      window.location.href = url;
      return;
    }

    if (provider === 'gmail') {
      url = buildGmailUrl(CONTACT.email, fields.subject, fields.body);
    } else if (provider === 'outlook') {
      url = buildOutlookUrl(CONTACT.email, fields.subject, fields.body);
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function initContactCompose() {
    const composeRoot = document.getElementById('contactCompose');
    if (!composeRoot) {
      return;
    }

    const subjectField = document.getElementById('contactSubject');
    if (subjectField && !subjectField.value) {
      subjectField.value = CONTACT.defaultSubject;
    }

    composeRoot.addEventListener('click', function(event) {
      const button = event.target.closest('[data-compose-provider]');
      if (!button) {
        return;
      }

      event.preventDefault();
      openCompose(button.getAttribute('data-compose-provider'));
    });

    composeRoot.addEventListener('input', clearError);
  }

  document.addEventListener('DOMContentLoaded', initContactCompose);
})();
