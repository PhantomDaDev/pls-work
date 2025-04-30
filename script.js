document.addEventListener('DOMContentLoaded', function() {
  const personSelect = document.getElementById('personSelect');
  const teacherLabel = document.getElementById('teacherLabel');
  const teacherNameInput = document.getElementById('teacherNameInput');
  const form = document.getElementById('appointmentForm');
  const formMessage = document.getElementById('formMessage');

  personSelect.addEventListener('change', function() {
    if (personSelect.value === "Teacher") {
      teacherLabel.style.display = "block";
      teacherNameInput.required = true;
    } else {
      teacherLabel.style.display = "none";
      teacherNameInput.required = false;
      teacherNameInput.value = "";
    }
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    formMessage.textContent = '';
    const formData = new FormData(form);
    const data = {
      name: formData.get('name').trim(),
      phone: formData.get('phone').trim(),
      email: formData.get('email').trim(),
      person: formData.get('person'),
      teacherName: formData.get('teacherName') ? formData.get('teacherName').trim() : ''
    };

    // Basic validation for teacher field
    if (data.person === "Teacher" && !data.teacherName) {
      formMessage.textContent = "Please specify which teacher you want to meet.";
      formMessage.style.color = "#d32f2f";
      return;
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (response.ok) {
        formMessage.textContent = "Appointment request sent successfully!";
        formMessage.style.color = "#388e3c";
        form.reset();
        teacherLabel.style.display = "none";
      } else {
        formMessage.textContent = result.error || "Failed to send. Please try again later.";
        formMessage.style.color = "#d32f2f";
      }
    } catch (err) {
      formMessage.textContent = "Network error. Please try again.";
      formMessage.style.color = "#d32f2f";
    }
  });
});