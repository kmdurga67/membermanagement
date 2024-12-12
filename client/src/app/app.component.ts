import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'client';
  memberForm: FormGroup;
  memberTypes = ['Regular', 'Premium', 'VIP'];
  submittedMembers: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.memberForm = this.fb.group({
      memberId: [{ value: '', disabled: true }],
      memberName: '',
      memberAddress: '',
      joiningDate: '',
      memberType: ['Regular'],
      renewalDate: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    this.generateMemberId();
    this.fetchMembers();

  }

  generateMemberId() {
    const id = `MEM${Date.now()}`;
    this.memberForm.patchValue({ memberId: id });
  }

  calculateRenewalDate() {
    const joiningDate = this.memberForm.get('joiningDate')?.value;
    if (joiningDate) {
      const renewalDate = new Date(joiningDate);
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
      this.memberForm.patchValue({ renewalDate: renewalDate.toISOString().split('T')[0] });
    }
  }

  fetchMembers() {
    this.http.get('http://localhost:3000/members').subscribe({
      next: (members: any) => {
        this.submittedMembers = members;
        console.log(this.submittedMembers);
      },
      error: (error) => {
        console.error('Error fetching members:', error);
        alert('Failed to fetch members.');
      },
    });
  }

  onSubmit() {
    if (this.memberForm.valid) {
      const formData = this.memberForm.getRawValue();
      this.http.post('http://localhost:3000/members', formData, { responseType: 'json' }).subscribe({
        next: (response) => {
          alert('Member registered successfully!');
          this.submittedMembers.push(formData); // Add new member to the table
          this.memberForm.reset(); // Reset the form
          this.generateMemberId(); // Regenerate Member ID
        },
        error: (error) => {
          console.error('Error occurred:', error);
          alert('Failed to register member. Please try again.');
        },
      });
    }
  }  

  cancelForm(){
    this.memberForm.reset();
    this.generateMemberId();
  }
}
