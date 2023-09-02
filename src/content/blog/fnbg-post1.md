---
author: Fabian Berger
pubDatetime: 2023-09-02T08:16:00Z
title: How to handle iFrames in Cypress 12.17.4
postSlug: how-to-handle-iframes-in-cypress-12.17.4
featured: true
draft: false
tags:
  - Typescript
  - Cypress
  - Test Automation
ogImage: ""
description: How to handle iFrames in Cypress 12.17.4 in a typescript environment
---

iFrames can be a pain to deal with in Test Automation.
Here is my current setup to handle them in Cypress:

## Code

My current implementation for the getIframe method.

```ts
// support/Base.ts
/**
   * Can be problematic if more iframes exist.
   * Not chainable at the moment.
   *
   * @example getIframe().find('.user-data.truncate').click();
   * @example getIframe().contains('Choose user').click();
   * @returns The first iframe it finds.
   */
getIframe(): Cypress.Chainable<any> {
    return cy.get('iframe').its('0.contentDocument.body').should('not.be.empty').then(cy.wrap);
  }
});
```

For better autocompletion, we don't use Cypress Custom commands directly, but use normal imports for different classes of functions.

Example test file:

```ts
// support/Example.ts

import { Base } from "../../support/Base";
import { Foo } from "../../support/Foo";

let base: Base = new Base();
let foo: Foo = new Foo();

describe("Example test folder", () => {
  it("Example test", () => {
    foo.login();
    base.getIframe().find("main button:nth-of-type(1)");
    foo.logout();
  });
});
```

More examples:

```ts
cy.get('.user-data.truncate').click(); 
this.getIframe().find('.user-data.truncate').click();

cy.contains('Benutzer auswählen').click(); 
this.getIframe().contains('Benutzer auswählen').click();
```
