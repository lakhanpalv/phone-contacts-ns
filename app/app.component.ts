import {Component} from '@angular/core';
import {Contact} from './shared/contact';
export var permissions = require('nativescript-permissions');
export var contacts = require('nativescript-contacts');
declare var android:any;

@Component({
    selector: 'my-app',
    templateUrl:'app.component.html'
})

export class AppComponent {
    public contactsList:Array<Contact> = [];
    public viewUpdated:boolean;

    constructor() {
       this.viewUpdated = false;
    }

    public get contactsArr():Array<any> {
        if (this.contactsList.length > 0) {
            return this.contactsList;
        } else {
            return [new Contact('No Contacs found')];
        }
    }

    public getPhoneContacts() {
        var perm = permissions.requestPermission(android.Manifest.permission.READ_CONTACTS,
                    'Please click allow to fetch contacts from your phone');
            perm.then(() => {
                contacts.getAllContacts()
                .then((args) => {
                    var localArr:Array<any> = args.data;
                    for (var i = 0; i < localArr.length; i++) {
                        if(localArr[i].name !== null){
                            if(localArr[i].phoneNumbers !== null) {
                                for(var j=0; j < localArr[i].phoneNumbers.length;j++) {
                                    //select number only if it's mobile number
                                    if(localArr[i].phoneNumbers[j].label === 'Mobile') {
                                        if(localArr[i].emailAddresses.length !== 0) {
                                            for(var k=0; k < localArr[i].emailAddresses.length; k++) {
                                                    this.contactsList.push(new Contact(localArr[i].name.displayname, 
                                                                    localArr[i].phoneNumbers[j].value, 
                                                                    localArr[i].emailAddresses[k].value));
                                                break;
                                            }
                                        } else {
                                            this.contactsList.push(new Contact(localArr[i].name.displayname, 
                                                                localArr[i].phoneNumbers[j].value));
                                        }
                                        break;
                                    }
                                }
                            } else {
                                if(localArr[i].emails.length !== 0) {
                                    for(var k=0; k < localArr[i].emails.length; k++){
                                        this.contactsList.push(new Contact(localArr[i].name.displayname, '',
                                                                localArr[i].emails[k].value));
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }, (err) => {
                    console.log('Error: '+  err);
                });
            }).catch(() => {
                console.log('Uh no permsions :(');
        });
    }
}
