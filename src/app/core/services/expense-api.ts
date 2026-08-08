import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Expense, ApiResponse, PageResponse } from '../../shared/models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseApi {
  private http = inject(HttpClient);
  private apiUrl = 'https://smart-ledger-backend-g024.onrender.com/api/expenses';

  getExpenses(search?: string): Observable<Expense[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<ApiResponse<PageResponse<Expense>>>(this.apiUrl, { params }).pipe(
        map(response => {
          const items = response.data?.content || [];
          return items.map(exp => ({
            ...exp,
            emoji: '💸',
            iconBg: 'bg-danger/10',
            iconColor: 'text-danger',
            subtitle: exp.category || 'General',
            amountClass: 'text-danger'
          }));
        })
    );
  }

  addExpense(expense: Partial<Expense>): Observable<Expense> {
    return this.http.post<ApiResponse<Expense>>(this.apiUrl, expense).pipe(
        map(res => res.data)
    );
  }

  updateExpense(id: string | number, expense: Partial<Expense>): Observable<Expense> {
    return this.http.put<ApiResponse<Expense>>(`${this.apiUrl}/${id}`, expense).pipe(
        map(res => res.data)
    );
  }

  deleteExpense(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}