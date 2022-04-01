import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationService } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { contacts } from 'app/mock-api/apps/contacts/data';

@Injectable({
  providedIn: 'root'
})
export class SearchMockApi {

  private readonly _contacts: any[] = contacts;

  constructor(
    private _fuseMockApiService: FuseMockApiService,
    private _fuseNavigationService: FuseNavigationService
  ) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  registerHandlers(): void {
    this._fuseMockApiService
      .onPost('api/common/search')
      .reply(({ request }) => {

        // Get the search query
        const query = cloneDeep(request.body.query.toLowerCase());

        // If the search query is an empty string,
        // return an empty array
        if (query === '') {
          return [200, { results: [] }];
        }

        // Filter the contacts
        const contactsResults = cloneDeep(this._contacts).filter(user => user.name.toLowerCase().includes(query));

        // Create the results array
        const results = [];

        // If there are contacts results...
        if (contactsResults.length > 0) {
          // Normalize the results while marking the found chars
          contactsResults.forEach((result) => {

            // Normalize
            result.title = result.name;
            result.resultType = 'contact';

            // Make the found chars bold
            const re = new RegExp('(' + query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'ig');
            result.title = result.title.replace(re, '<mark>$1</mark>');

            // Add a link
            result.link = '/apps/contacts/' + result.id;
          });

          // Add the results to the results object
          results.push(...contactsResults);
        }

        // Return the response
        return [200, { results }];
      });
  }
}
