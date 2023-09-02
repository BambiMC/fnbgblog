---
author: Fabian Berger
pubDatetime: 2023-09-02T10:23:00Z
title: Small useful Cypress oneliners / \"fewliners\"
postSlug: small-useful-cypress-oneliner/\"fewliners\"
featured: true
draft: true
tags:
  - Typescript
  - Cypress
  - Test Automation
ogImage: ""
description: How to find CSS selectors efficiently in Cypress 12.17.4
---

My current list of small code snippets

## Arbeiten mit Rückgabewerten:

- Wie return’t man Werte aus einem Custom Command:
  getUserId(userEmail: string): any {
  expect(userEmail).to.not.equal(undefined);

return new Promise(function (resolve, reject) {
cy.request({…}).then((response) => {
resolve(response.body.id);
});
});
}

- Wie verwendet man diese Werte weiter:
  this.restGetUserId(userEmail).then(userId => {
  this.restPutTutorial(userId);
  });

- Wie man mehrere Rückgabewerte zurückgibt:
  getProcessInfo(processName: string): any {
  expect(processName).to.not.equal(undefined);
  return new Promise(function (resolve, reject) {
  cy.request({…}).then((response) => {
  let processInfos = {
  processId: response.body.searchResultsProcess.docs[0].id,
  processVersion: response.body.searchResultsProcess.docs[0].version,
  };
  resolve(processInfos);
  });
  });
  }

Sonstiges:

- Checken, ob Eingabe-Parameter passt:
  expect(specificParameter).to.be.oneOf(['link', 'video', 'file']);
  expect(specificParameter).to.be.oneOf([true, false]);
  expect(specificParameter).to.not.equal(undefined);

- Den Rückgabewert eines Requests im Testverlauf sichtbar machen (bzw. loggen):
  cy.log(response.body);
- Überprüfen, dass ein Element/eines seiner Kinder einen bestimmten Text enthält:
  cy.get('.footer-copyright').contains('MID GmbH');
- Überprüfen, ob ein Element einen bestimmten Text beinhaltet: (andere Methode)
  cy.get('.results').then(searchResultsText => {
  if (searchResultsText.text().includes(Auf Lager)) {
  cy.log('This product is available!');
  } else {
  cy.log('This product is not available!');
  }
  })

- Checken, ob Element bestimmten Link enthält:
  cy.get('.s5 > a').should('have.attr', 'href', 'https://www.mid.de/');

- Überprüfen, dass ein Button disabled ist:
  cy.get('.ng-valid-maxlength .valign-wrapper button').should('be.disabled');

- Überüfen, wie viele Elemente zu einem bestimmten Pfad zu finden sind: (Geht nicht für überhaupt nicht existierenden Elemente  muss >= 1 sein)
  this.getIframe().find('mat-list-option').should('have.length', 5);

- In einem IFrame ein Element ansteuern, bis zu einem gewissen Punkt zurückgehen(„herauszoomen“), und dann mit einem neuen Pfad weitersuchen:
  this.getIframe().contains(title).parents('bp-attachment').find('button').click();

- Enter-Key drücken:
  cy.get('#nicesInputElementMitNerID').type('{enter}');

- Überprüfen, dass ein Element nicht existiert:
  this.getIframe().find('.bpmn-lint-button').should('not.exist');

- Check, dass ein Input einen bestimmten Text (nicht) enthält:
  this.getIframe().find('table > mat-cell input').should('(not.)have.value', steps[2]);

- Einer Methode ein Array mitgeben, welche dann für jedes Element einmal in einer Schleife durchläuft:
  checkTasksExist(tasks, shouldExist = true) {
  expect(tasks).to.not.equal(undefined);
  expect(shouldExist).to.be.oneOf([true, false]);
  for (const task of tasks) {
  this.getIframe().find("g[data-element-id^='Activity']").contains(task);
  }
  }

- Die Antwort eines REST-Requests loggen:
  cy.log(response.body);

- Die momentane URL des Test Runners überprüfen:
  cy.url().should('include', '/timeline');
  cy.url().should('eq', 'https://docker01.mid.de:26443/timeline');

- Iterate over all selected elements and print its text/content:
  cy.get('.notification-text').each((item, index, list) => {
  cy.log(item.text());
  });

- Iterate over fixture:
  cy.fixture('UserProfiles/TestProfiles_complete.json').then((users) => {
  users.forEach((user) => {
  cy.login(user.email, user.password);
  cy.logout();
  })
  })
