---
author: Fabian Berger
pubDatetime: 2023-09-02T10:20:00Z
title: "My take on: How to find CSS selectors efficiently in Cypress 13.1.0"
postSlug: how-to-find-css-selectors-efficiently-in-cypress-13.1.0
featured: true
draft: false
tags:
  - Typescript
  - Cypress
  - Test Automation
ogImage: ""
description: How to find CSS selectors efficiently in Cypress 13.1.0
---

Under normal circumstances, you can just use the css selector generator inside the cypress test runner.
But in special cases, like when you want to navigate inside an iframe, this will not work.
Also you might want to consider writing out your css selectors yourself.

These will be more accurate, break less often and will be easier to understand and maintain by your fellow testers in your team.
With automatically generated paths i mostly have to check per hand, which object is selected, with manually created paths, this is rarely necessary, because the path speaks for itself.

## So what does my workflow look like

Although i do like you use firefox, in this case i have to use chrome.

The best plugin to find and test css selectors imho is "Ranorex Selocity".
Sadly it's only available for chromium browsers.

Although the auto-generated paths are rubbish, with Selocity i can quickly manually create the css selectors.
In combination with developer tools inside Chrome, it's the perfect combination to work efficiently and get much better results.
