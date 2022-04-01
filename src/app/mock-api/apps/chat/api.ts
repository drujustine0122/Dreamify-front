import { Injectable } from '@angular/core';
import { assign, cloneDeep, omit } from 'lodash-es';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import {
  topics as topicsData,
  contacts as contactsData,
  messages as messagesData,
  profile as profileData
} from 'app/mock-api/apps/chat/data';

@Injectable({
  providedIn: 'root'
})
export class ChatMockApi {
  private _topics: any[] = topicsData;
  private _contacts: any[] = contactsData;
  private _messages: any[] = messagesData;
  private _profile: any = profileData;

  /**
   * Constructor
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();

    // Modify the topics array to attach certain data to it
    this._topics = this._topics.map(topic => ({
      ...topic,
      // Get the actual contact object from the id and attach it to the topic
      contact: this._contacts.find(contact => contact.id === topic.contactId),
      // Since we use same set of messages on all topics, we assign them here.
      messages: this._messages.map(message => ({
        ...message,
        topicId: topic.id,
        contactId: message.contactId === 'me' ? this._profile.id : topic.contactId,
        isMine: message.contactId === 'me'
      }))
    }));
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Chats - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/apps/topic/topics')
      .reply(() => {

        // Clone the topics
        const topics = cloneDeep(this._topics);

        // Return the response
        return [200, topics];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Chat - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/apps/topic/topic')
      .reply(({ request }) => {

        // Get the topic id
        const id = request.params.get('id');

        // Clone the topics
        const topics = cloneDeep(this._topics);

        // Find the topic we need
        const topic = topics.find(item => item.id === id);

        // Return the response
        return [200, topic];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Chat - PATCH
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onPatch('api/apps/topic/topic')
      .reply(({ request }) => {

        // Get the id and topic
        const id = request.body.id;
        const topic = cloneDeep(request.body.topic);

        // Prepare the updated topic
        let updatedChat = null;

        // Find the topic and update it
        this._topics.forEach((item, index, topics) => {

          if (item.id === id) {
            // Update the topic
            topics[index] = assign({}, topics[index], topic);

            // Store the updated topic
            updatedChat = topics[index];
          }
        });

        // Return the response
        return [200, updatedChat];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Contacts - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/apps/topic/contacts')
      .reply(() => {

        // Clone the contacts
        let contacts = cloneDeep(this._contacts);

        // Sort the contacts by the name field by default
        contacts.sort((a, b) => a.name.localeCompare(b.name));

        // Omit details and attachments from contacts
        contacts = contacts.map(contact => omit(contact, ['details', 'attachments']));

        // Return the response
        return [200, contacts];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Contact Details - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/apps/topic/contact')
      .reply(({ request }) => {

        // Get the contact id
        const id = request.params.get('id');

        // Clone the contacts
        const contacts = cloneDeep(this._contacts);

        // Find the contact
        const contact = contacts.find(item => item.id === id);

        // Return the response
        return [200, contact];
      });

    // -----------------------------------------------------------------------------------------------------
    // @ Profile - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService
      .onGet('api/apps/topic/profile')
      .reply(() => {

        // Clone the profile
        const profile = cloneDeep(this._profile);

        // Return the response
        return [200, profile];
      });
  }
}
