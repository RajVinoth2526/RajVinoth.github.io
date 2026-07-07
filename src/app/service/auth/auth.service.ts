import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SupabaseService } from '../supabase/supabase.service';
import { User, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentSession$ = new BehaviorSubject<Session | null>(null);

  constructor(private supabaseService: SupabaseService) {
    this.supabaseService.client.auth.getSession().then(({ data }) => {
      this.currentSession$.next(data.session);
    });

    this.supabaseService.client.auth.onAuthStateChange((_event, session) => {
      this.currentSession$.next(session);
    });
  }

  get authState(): Observable<User | null> {
    return this.currentSession$.pipe(map((session) => session?.user ?? null));
  }

  get sessionChanges(): Observable<Session | null> {
    return this.currentSession$.asObservable();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await this.supabaseService.client.auth.getUser();
    return data.user;
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    return this.supabaseService.client.auth.signInWithPassword({ email, password });
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    return this.supabaseService.client.auth.signUp({ email, password });
  }

  async signOut() {
    return this.supabaseService.client.auth.signOut();
  }

  async resetPassword(email: string) {
    return this.supabaseService.client.auth.resetPasswordForEmail(email);
  }

  async getAccessToken(): Promise<string | null> {
    const { data } = await this.supabaseService.client.auth.getSession();
    return data.session?.access_token ?? null;
  }
}
