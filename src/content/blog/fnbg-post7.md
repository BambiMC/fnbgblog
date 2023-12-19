---
author: Fabian Berger
pubDatetime: 2023-12-19T13:00:00Z
title: Cypress - Typs & Tricks
postSlug: cypress-tips-and-tricks
featured: true
draft: false
tags:
  - cypress
  - test automation
  - typescript
  - cheatsheet
ogImage: ""
description: My documentation / takeaways from working with Cypress in a typescript environment
---

## Inhaltsverzeichnis

1. [Basic information about our tests](#basic-information-about-our-tests)
2. [Basic structure of a test](#basic-structure-of-a-test)
3. [How To CSS Selectors](#how-to-css-selectors)
4. [Code Snippets - Examples](#code-snippets-examples)
5. [Development Workflow](#development-workflow)
6. [Anti-Patterns](#anti-patterns)
7. [Sequence of steps in a test](#sequence-of-steps-in-a-test)
8. [WTF Cypress, what's wrong with you?](#wtf-cypress-whats-wrong-with-you)
9. [Type-Doc Documentation](#type-doc-documentation)
10. [Explanation of a sample test](#explanation-of-a-sample-test)
11. [Important to know](#important-to-know)
12. [Have questions?](#have-questions)

# Basic Information About Our Tests

**Most important of all:** Please take a moment to quickly go through this documentation before you start development. It contains many details that could otherwise cause confusion.

Since 2021, we have been increasingly using Cypress instead of Ranorex for UI tests. Currently, only Cypress tests are run during the night.

**Visual Studio Code is highly recommended!** ([IDE Integration](https://docs.cypress.io/guides/tooling/IDE-integration)) We use TypeScript, which has proven itself in our projects.

For the current tests, we use the provided Electron browser and Firefox. A [TypeDoc](https://typedoc.org/) documentation is integrated into the project; further information is available in the respective section.

We aim to skip the UI as directly as possible through corresponding methods in the Rest class to achieve time savings.

The tests are constructed using the following two constructs. (One could also use `context()` and `specify()`, but we stick to the Cypress standard here)

- `describe`: Test folder
- `it`: Test

**Important Points:**

- `it` within an `it`: IGNORES EVERYTHING inside the inner `it` --> do not use!
- `describe` within an `it`: PRETENDS (in the test runner) as if the `describe` does not exist, but the content of the `describe` is still executed --> do not use!
- `describe` within a `describe`: practically infinitely possible --> use!
- `it` within a `describe`: `it` is executed wonderfully and marked as a test in the test run --> use!
- Only in direct `it’s` are test cases also marked as such. If tested in `describe` (not in `it`) and fails → AssertionError.

As a starting point, we recommend the following resources:

- [https://www.youtube.com/watch?v=BQqzfHQkREo](https://www.youtube.com/watch?v=BQqzfHQkREo)

## Basic structure of a test

```typescript
import { Base } from "../../support/Base";
import { App } from "../../support/App";
import { Rest } from "../../support/Rest";
import { SSH } from "../../support/SSH";
import { OrgStrModule } from "../../support/testModules/OrgStrModule";
import { UserModule } from "../../support/testModules/UserModule";

let base: Base = new Base();
let app: App = new App();
let ssh: SSH = new SSH();
let restRequest: Rest = new Rest();
let orgStr: OrgStrModule = new OrgStrModule();
let user: UserModule = new UserModule();

before("Reset Nightly, test preparation and rest login", () => {
  ssh.resetNightly_PC25();
  ssh.resetNightly_dev();
  base.setRunEnvVar();
  restRequest.login();
});

describe("Wow what a great test", () => {
  it.skip("Dont do something", () => {
    app.login();
    //...
  });
  it.only("Do something else, for example Add and Check an orgStructure", () => {
    app.login();
    app.gotoOrgStructure();
    orgStr.addOrgStructure("tailwind");
    restRequest.search("orgunit", "tailwind");
  });
});

describe("Another great test", () => {
  it("Upload a process", () => {
    app.login();
    user.importProcess("cypress/fixtures/Processes/Guide.bpmn");
  });
  //...
});
```

## How To CSS Selectors

Depending on your experience with it, this might require some learning time. As long as there are no iframes present, it works quite well with the test runner. However, when more iframes are introduced, the test runner struggles, and paths need to be found manually.

In my opinion, it works best with Chrome in conjunction with Ranorex (Yes, you heard it right) Selocity. Here, you can directly find and test paths without intermediaries. (Ranorex Selocity is a Chrome plugin and not available for Firefox.) If Firefox is a must (I also like using Firefox, but for this purpose, Selocity is just too good not to use), you can use SelectorsHub (Plugin for Firefox & Chrome) instead. (really not recommended, but better than nothing, i guess)

Example Selectors:

1. `div[id^=manageProcessTextFilterDropdown] > div.input-field input`
2. `dialog input[formcontrolname]:not([formcontrolname=title])`

## Code Snippets - Examples

### Working with Iframes:

```typescript
cy.get('.user-data.truncate').click(); -->
this.getIframe().find('.user-data.truncate').click();

cy.contains('Benutzer auswählen').click(); -->
this.getIframe().contains('Benutzer auswählen').click();
```

- Working with double-nested iframes:
  No proper method available, but problem can be kinda solved with the "real-events" plugin:

```typescript
this.getIframe().find("vorheriger Input").realPress("Tab").realType("HEUREKA");
```

### Arbeiten mit Rückgabewerten:

- Working with return values:

```typescript
getUserId(userEmail: string): any {
  return new Promise(function (resolve, reject) {
    cy.request({…}).then((response) => {
      resolve(response.body.id);
    });
 });
}
```

- How to use these values further:

```typescript
this.restGetUserId(userEmail).then(userId => {
  this.restPutTutorial(userId);
});
```

- How to return multiple return values:

```typescript
getProcessInfo(processName: string): any {
  return new Promise(function (resolve, reject) {
    cy.request({…}).then((response) => {
      let processInfos = {
        processId: response.body.searchResultsProcess.id,
        processCheck: response.body.searchResultsProcess.check,
      };
      resolve(processInfos);
    });
  });
}
```

### Miscellaneous:

- Change the test environment (local):

```typescript
base.setVars_dev("name1", "https://instance.foo.com");
base.setVars_dev("name2", "https://instance.bar.com");
```

- Den Rückgabewert eines REST-Requests im Testverlauf sichtbar machen (bzw. loggen):

```typescript
cy.log(response.body);
```

- Check that an element/one of its children contains a specific text:

```typescript
cy.get('.results').then(searchResultsText => {
     if (searchResultsText.text().includes(Auf Lager)) {
          cy.log('This product is available!');
     } else {
          cy.log('This product is not available!');
     }
})
```

- Check whether an element contains a specific link:

```typescript
cy.get(".s5 > a").should("have.attr", "href", "https://www.foo.com/");
```

- Element is overlaid by another element or is not visible, but should still be able to be pressed:

```typescript
cy.contains("end current task").click({ force: true });
```

- Check that a button is disabled:

```typescript
cy.get(".ng-valid-maxlength .valign-wrapper button").should("be.disabled");
```

- Check how many elements can be found for a specific path: (Does not work for elements that do not exist at all --> must be >= 1)

```typescript
this.getIframe().find("mat-list-option").should("have.length", 5);
```

- Select an element in an IFrame, go back to a certain point ("zoom out"), and then continue searching with a new path:

```typescript
this.getIframe()
  .contains(title)
  .parents("lk-attachment")
  .find("button")
  .click();
```

- Press the enter key:

```typescript
cy.get("#elementWithId").type("{enter}");
```

- Check that an element does not exist:

```typescript
this.getIframe().find(".check-button").should("not.exist");
```

- Check that an input (does not) contain a certain text:

```typescript
this.getIframe()
  .find("table > mat-cell input")
  .should("(not.)have.value", steps[2]);
```

- Assign an array to a method, which then runs through each element once in a loop:

```typescript
checkTasksExist(tasks, shouldExist = true) {
  for (const task of tasks) {
       this.getIframe().find("g[test-element-id^='Activity']").contains(task);
  }
}
```

- Check the current URL of the Test Runner:

```typescript
cy.url().should("include", "/timeline");
cy.url().should("eq", "https://foo.com/bar");
```

- Iterate over all selected elements and print its text/content:

```typescript
cy.get(".notification-text").each((item, index, list) => {
  cy.log(item.text());
});
```

- Iterate over fixture:

```typescript
cy.fixture("UserProfiles/TestProfiles_complete.json").then(users => {
  users.forEach(user => {
    cy.login(user.email, user.password);
    cy.logout();
  });
});
```

## Development Workflow

### Start a Cypress test locally:

- Start VSC
- `...\git\app-cypress` open
- `PS C:\Users\lk\Git\app-cypress> npx cypress open`
- Start test (we are currently only using the supplied Elektron browser)

### (New) creation of the documentation:

- `PS C:\Users\lk\Documents\Git\app-cypress> npx typedoc --options "typedoc.json"`
- In VSC: `./doc/index.html` → right-click → Open with Live Server [VSCode plugin]
- Docu: [http://127.0.0.1:5500/doc/interfaces/Cypress.cy.html](http://127.0.0.1:5500/doc/interfaces/Cypress.cy.html)

### Create a new method:

- Write the new method in the corresponding class (without documentation!)
- Declare and document the method directly above it

### Create a new test:

- Create the test suite correctly in the folder structure
- Create a corresponding modules file in `Support/testModules` (only if necessary)
- Include the file in the `support/index.js` file
- Structure: based on the example structure described here
- Include in Jenkins → Nightly test

### Include in Jenkins:

- Goto test automation
- Create element
- Enter name → Copy from (e.g.) Cy-Foo
- Configuration: Leave everything as it is, only customize test file
- Adjustable: Run Parameter: (ONLY THOSE LISTED HERE!) (see `genSetRunEnvVar` method)
  - `--env identityDomainName=bar`
  - `--config baseUrl=(default value) https://foo.com`

### Integrate a plugin:

- Move the file to the `plugins` folder
- Include in the `plugins/index.js` file

### Create CSS paths for elements:

There are several options for this:

- Directly in Cypress with the crosshair next to the URL, recommended if it is not iFrames, the tool cannot handle this yet (but is under development)
- If it is iFrames, we recommend the detour via Ranorex Selocity in Chrome or any other plugins, such as SelectorsHub for Firefox
- Mostly just trial & error until you have something decent
  Please note: Everywhere the single quotes (') and the slashes (/)(???? Really???) must be escaped using a backslash (\), otherwise the whole thing won't work!

### Set up the test setup:

Recommended (by Cypress) code editor: VS Code
Other necessary software: NPM, Putty, Git, (Python(see 3 lines further))
Check the documentation for completeness (you would need Python for this)

- Execute the following command: `python checkDokuCoverage.py`

### Include new test in Jenkins:

- Open Jenkins page: [http://jenkins.foo.com/](http://jenkins.foo.com/)
- Open the Test automation tab
- Click on "Create element" in the top left corner
- Enter the name (Cy-Foo)
- Copy from an existing test (e.g. Cy-Bar)
- Click "OK" at the bottom edge
- Parameters to be changed:
  - Build procedure: `.\node_modules\.bin\cypress run --spec "cypress/e2e/Example/Example.cy.ts"`
- Adjustable: Run parameters: (ONLY THOSE LISTED HERE!) (see `genSetRunEnvVar` method)
  - `--env identityDomainName=bar`
  - `--config baseUrl=https://foo.com`

## Anti-Patterns

### Conditional Testing

Actually not to be used, [more info here](https://docs.cypress.io/guides/core-concepts/conditional-testing). But I know as well as you do that sometimes it is simply necessary anyway, so here are the corresponding code snippets (in the outer `get`'s simply use any object that is outside the element to be searched for with `find`, for example the body, but you can also narrow it down a bit so that the `find` CSS selector is correspondingly shorter/safer):

- The element `#wrapper .s_listing` exists? (Wrapper must exist in any case)
- The element small.heading-counter' must exist, does the element contain the text: `16`?

```typescript
cy.get("small.heading-counter").then(searchResultsNumber => {
  if (searchResultsNumber.text().includes("16")) {
    cy.log("There is a '16' in here somewhere:" + searchResultsNumber.text());
  }
});
```

- Intentionally failing the test:

```typescript
expect(5).to.equal(undefined);
```

- If tests are to check different element paths depending on the use case, but it would be too cumbersome / time-consuming to pass a parameter for this now: Write as in the first case above and then check with an auxiliary variable (see 'Hints' in the example) whether one of the two (or more) paths has found an element.

## Sequence of a test

As an example, to make the logic clear: The numbers indicate the respective sequence:

<img src="/assets/blogContent/CypressDoc/Bild3.png" alt="Image 3" width="400" /> <img src="/assets/blogContent/CypressDoc/Bild4.png" alt="Image 4" width="400" />

## WTF Cypress, what's wrong with you?

Cypress does some things that you probably wouldn't expect as a new user and are not obviously documented anywhere (see the sequence of a test, but maybe I'm just a blind fish and it is somewhere). So here is a small compilation of further inconsistencies that you are guaranteed to stumble across! I hope this helps! ^^

1. Read the [Best Practice's](https://docs.cypress.io/guides/references/best-practices) and stick to it halfway, but don't be sad if it doesn't work (I mean how many cy.wait(x) do we have in our tests, which are definitely necessary!) Can be partially optimized in the future, as the affected computers now have better hardware (Yey, future!)

2. `let` / `var` do not work as usual in typescript (within a test only `const` works) (don't even try! (between 2 tests))

   - You cannot work with the return values of a Cypress method, because async
   - Example of how you can still work with variables:
     - Does not work:
       ```typescript
       const articleID = cy.location("pathname").split("/")[2];
       ```
     - Works:
       ```typescript
       cy.location("pathname").then(path => {
         const articleID = path.split("/")[2];
         cy.wrap(articleID).as("articleID");
       });
       ```
     - Works (and is easier to read):
       ```typescript
       cy.location("pathname").invoke("split", "/").its(2).as("articleID");
       ```

3. it is possible that the website to be tested generally outputs some errors when loading that are not handled. Cypress will not continue in such a case, which is generally not a bad thing! In this case, the developers should be informed in any case, but can be circumvented with the following measure in the "support/e2e.ts" file:

   ```typescript
   Cypress.on("uncaught:exception", (err, runnable) => {
     return false;
   });
   ```

4. if Cypress interacts with an element (here only commands such as click, type or clear are meant, (EXPRESSLY NOT: get, find, contains, etc. because it does not do this)) strangely scrolls to the element in such a way that strange errors occur, then it is recommended to adjust the [scroll behavior](https://docs.cypress.io/guides/core-concepts/interacting-with-elements#Scrolling). This is how the whole thing works with such a problematic element:

   ```typescript
   this.getIframe()
     .find(".prop-sect input")
     .type(name, { scrollBehavior: false });
   ```

5. for example, when .clear() a process property in the modeler, the entire property is deleted. To get around this, there is the environment variable `Cypress.env('25backspaces')`, which, if built into a type, simply deletes a character 25 times manually:

   ```typescript
   this.getIframe()
     .find("div.properties-section > input")
     .type(Cypress.env("25backspace"))
     .type(newValue);
   ```

6. if you need variables during a complete test run, whether cross-domain or despite other test issues that may cause the test runner to reload, etc., then here is a possibility that saves the whole thing in the node backend. It works really well, but is more complex than the variant shown above:

   - In the plugins/index.js:

     ```typescript
     let memory = 0;

     module.exports = (on, config) => {
       on("task", {
         setMemory: val => {
           return (memory = val);
         },
         getMemory: () => {
           return memory;
         },
         // Further corresponding methods can follow here (also for further
         // variables), logically not only get/set possible,
         // but (e.g.) an increment method is also conceivable, which can be used for all
         // variables used in the node backend by 1, etc.
       });
     };
     ```

   - Use (e.g.) (here an exemplary increment method implemented as a custom command):
     ```typescript
     Cypress.Commands.add("increaseMemory", () => {
       cy.task("getMemory").then(currentMemory => {
         cy.task("setMemory", ++currentMemory);
       });
     });
     ```

7. if you call a `cy.task` method, you must pass a non-empty string as the first argument if parameters are passed. In addition, there must always be at least one `return null` to signal that the task has been handled. Also, a maximum of one parameter may be passed if several are to be passed, [here](https://docs.cypress.io/api/commands/task#Set-timeout-in-the-test-configuration) the solution.

## Type-Doc Documentation

Module prefixes: There are not corresponding tests for every module file, the modules sometimes simply combine topic-specific methods
How we design documentation comments:

```typescript

  /**
   * Upload a attachment to a process via a Rest-Request
   *
   * @example uploadAttachment('file', 'Versand', 'Attachments/DHL=good.txt');
   * @param type - type of attachment ['link', 'video', 'file']
   * @param fixtureSource - corresponding process file location
   */
  uploadAttachment(type: 'link' | 'video' | 'file', fixtureSource: string) {…}

  /**
   * Upload a process over Rest-Requests
   *
   * @example importProcess('/Processes/Test.bla', true, '');
   * @example importProcess('/Processes/Test.bla');
   * @example importProcess('/Processes/Test.bla', 'Name for Test');
   * @param filePath - the path to the process file
   * @param shouldWait - should wait for some time to be registered in the UI
   * @param processName - sometimes the name of the process can be different to the filename, if that\'s the case, use this parameter
   */
  importProcess(filePath: string, shouldWait: boolean = true, processName: string = '') {…}
```

Template for quickly creating the documentation for a method:

```typescript
  /**
   *
   *
   * @example cy.();
   * @example cy.();
   * @param  -
   * @param  -
   */
  (?: string): void;
```

Methode returned eine Liste an Werten:

```typescript
  /**
   * Return all information of this process
   *
   * @example cy.restGetProcessInfo('foo');
   * @param processName - the name of the process
   */
  restGetProcessInfo(processName: string): {
    processId: string;
    processVersion: string;
  };
```

## Explanation of an example test

  <img src="/assets/blogContent/CypressDoc/Bild5.png" alt="Image description">

it.skip() skips the corresponding test.

It.only() executes ONLY the one test, skips all others.

Cypress.env("foo") calls the environment variable with the name "foo" defined in cypress.config.ts and sets it here accordingly.

## Important to know

Typescript case conventions: The same as Javascript:

- PascalCase for modules and classes
- camelCase for methods and others

For methods, always use the delay AFTER the action in the same method for timing reasons, NOT directly before the next action in another method, don't ask me why, but it makes a difference! In addition, more robust when developing new tests, as an action is always completed cleanly and you don't have to hope that the methods after/before will allow enough time
When renaming a method, always use Ctrl+Shift+F[VSC] to search and replace in all files so that the declaration and documentation in the type definitions remain up to date.

## Any questions?

Feel free to contact me if you have any questions, suggestions or errors regarding this documentation or the project itself!
