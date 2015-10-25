---
layout : page
title : Contact
canonical : "http://timschreiber.com/contact/contact"
description : "Use this form to contact Timothy P. Schreiber."
---

<ol class="breadcrumb">
	<li><a href="/">Home</a></li>
	<li>{{page.title}}</li>
</ol>

<div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
	<div class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">Contact Form</h3>
		</div>
		<div class="panel-body">
      <form id="contactForm">
        <div class="form-group">
          <label>Your Email</label>
          <input id="Sender" type="email" class="form-control" placeholder="email@domain.com"/>
        </div>
        <div class="form-group">
          <label>Subject</label>
          <input id="Subject" type="text" class="form-control" placeholder="Type subject here..."/>
        </div>
        <div class="form-group">
          <label>Message</label>
          <textarea id="Message" class="form-control" placeholder="Type message here..." rows="8"></textarea>
        </div>
        <div class="checkbox">
          <label>
            <input id="CopySender" type="checkbox" />
            Send a copy of the message to my your email address.
          </label>
        </div>
        <p>
          <button type="submit" class="btn btn-primary"><span class="fa fa-paper-plane-o"></span> Send</button>
        </p>
      </form>
		</div>
	</div>
</div>
