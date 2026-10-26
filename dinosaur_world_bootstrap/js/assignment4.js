document.addEventListener('DOMContentLoaded', function () {
  const clock = document.getElementById('currentDateTime');
  if (clock) {
    function updateClock() { clock.textContent = new Date().toLocaleString('en-US', {dateStyle:'long',timeStyle:'medium'}); }
    updateClock(); setInterval(updateClock,1000);
  }
  const colorButton = document.getElementById('changeColor');
  if (colorButton) {
    const colors = ['#f8f9fa','#e8f5e9','#fff3cd','#e3f2fd','#fce4ec']; let index=0;
    colorButton.addEventListener('click', function () {index=(index+1)%colors.length; document.body.style.backgroundColor=colors[index];});
  }
  document.querySelectorAll('.faq-question').forEach(function (button) {
    button.addEventListener('click', function () {
      const panel=document.getElementById(button.getAttribute('aria-controls'));
      const opened=button.getAttribute('aria-expanded')==='true';
      button.setAttribute('aria-expanded',String(!opened)); panel.classList.toggle('faq-open',!opened);
    });
  });
  const modal=document.getElementById('subscribeModal');
  if(modal){
    const open=document.getElementById('openSubscribe');
    const close=document.getElementById('closeSubscribe');
    function hide(){modal.hidden=true;document.body.classList.remove('modal-active');open.focus();}
    open.addEventListener('click',function(){modal.hidden=false;document.body.classList.add('modal-active');close.focus();});
    close.addEventListener('click',hide);
    modal.addEventListener('click',function(e){if(e.target===modal)hide();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)hide();});
    document.getElementById('subscribeForm').addEventListener('submit',function(e){e.preventDefault();document.getElementById('subscribeStatus').textContent='Thank you for subscribing!';this.reset();});
  }
  const form=document.getElementById('validatedForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const name=document.getElementById('name').value.trim();
      const email=document.getElementById('email').value.trim();
      const password=document.getElementById('password').value;
      const confirm=document.getElementById('confirmPassword').value;
      const message=document.getElementById('message').value.trim();
      const errors=[];
      if(!name)errors.push('Name is required.');
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))errors.push('Enter a valid email address.');
      if(password.length<8)errors.push('Password must contain at least 8 characters.');
      if(password!==confirm)errors.push('Passwords do not match.');
      if(!message)errors.push('Message is required.');
      const result=document.getElementById('formResult');
      result.className=errors.length?'alert alert-danger mt-3':'alert alert-success mt-3';
      result.textContent=errors.length?errors.join(' '):'Form validated successfully! (Demo only: no data was sent.)';
    });
  }
});
