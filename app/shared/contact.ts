export class Contact {
  constructor(public name: string, public phone?: string, public email?:string) {}
  toString():string {
      return 'name: ' + this.name + ' phone: '+ this.phone + ' email: '+ this.email;
  }
}