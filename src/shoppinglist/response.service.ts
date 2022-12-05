import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  private errors: Array<any>;
  private status: string;
  private data: Array<any>;
  constructor() {
    this.errors = [];
    this.status = '';
    this.data = [];
  }
  successResponse(status: string, data: any) {
    this.errors = [];
    this.status = status;
    this.data = data;
    return { status: this.status, data: this.data, errors: this.errors };
  }
  errorResponse(errors: any) {
    this.errors = [];
    this.errors.push(errors);
    this.status = 'error';
    return { status: this.status, errors: this.errors };
  }
}
