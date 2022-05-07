import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  loading = false;

  constructor(private readonly supabase: SupabaseService) { }

  ngOnInit(): void {
  }

  async handleLogin(input: string) {
    try {
      this.loading = true;
      await this.supabase.signIn(input);
      alert("check your email for login link");
    } catch (error) {
      alert(error);
    } finally {
      this.loading = false;
    }
  }

}
