export class TodayModel {

  public _id!: string; // generated by mongoDB
  public date!: string;
  public fname!: string;
  public lname!: string;
  public service!: string;
  public numberOf!: number;
  //public where!: string;
  public createdAt!: Date; // generated by mongoDB
  constructor(model?: any) {
    Object.assign(this, model);
  }
}

