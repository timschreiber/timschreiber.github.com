--- 
layout: post
title: "How to Save Windows Spotlight Lockscreen Images"
canonical: "http://timschreiber.com/2016/02/15/how-to-save-windows-spotlight-lockscreen-images/"
author: "Tim"
comments: true
description: ""
tags:
- windows-10
- tips
---

It's silly and trivial, but one of my favorite features of Windows 10 is all the cool, new pictures that appear on my lockscreen from time to time. But I always thought it was an oversight on the part of Microsoft that they didn't let us use them as our desktop backgrounds.

I used to try to get the images by hitting `PrtScn` on the lockscreen, pasting it into Paint, saving it as a JPG, and then dragging it into Google Image Search to search by image. Only once in a while could I find a matching image without all the overlays and at a high enough resolution I could use as my desktop background. Each time I slogged through countless Google Images results, disappointed that I couldn't find the right pictures, I thought to myself, "there has got to be a better way." 

Sure enough, there is. It's not only a better way &mdash; it's kinda failproof. It just took a little digging around. So, let's get started:

1. Open the Run dialog prompt by holding down your windows key plus R (<span class="fa fa-windows"></span> + R).

![Run Dialog Prompt][1]

2. Copy this `%localappdata%\Packages\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\LocalState\Assets` and paste it into the Run dialog prompt. Click **OK**, and then a folder will open in File Explorer, with a bunch of cryptic filenames.

![Path Pasted into Run Dialog Prompt][2]

3. Copy all of those files to another folder (I created one on my Desktop called *Spotlight Images*. If you see a warning prompt when you try to copy the files, just click **OK**.

4. Close the Window you opened in Step 2. It's best to not accidentally mess up any of those files.

5. Back to the files you just copied... Now you need to rename all those files with a JPG extension. You could do them one at a time, but I think it's easier to do them all at once. Just **Shift + Right-click** with your mouse in the directory you copied all the images to, and then select the **Open command window here** option from the menu.

6. In the command prompt window, type `Ren *.* *.JPG` and hit **ENTER**.

7. Close the command prompt window.

8. Back in the window containing the files you copied over, make sure you're viewing them in thumbnail mode. It's pretty easy at this point to figure out which ones are Spotlight pictures and which ones aren't. You can hold down **CTRL** and left-click any files you don't want to keep and delete them all at once.
 
Congratulations! Now you have usable copies of the Spotlight lockscreen images that you can use for your desktop background or any other purpose! Windows 10 downloads new Spotlight pictures regularly, so it wouldn't be a bad idea to repeat these steps every couple of weeks or so to make sure you get all the ones you like.

[1]: /img/how-to-save-windows-spotlight-lockscreen-images/run-dialog.png
[2]: /img/how-to-save-windows-spotlight-lockscreen-images/run-dialog-2.png