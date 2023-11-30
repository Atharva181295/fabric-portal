import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private baseUrl = 'http://localhost:8000';
  private projectsApiUrl = `${this.baseUrl}/api/projects`;
  private addProjectApiUrl = `${this.baseUrl}/api/projects/`;

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any> {
    return this.http.get(this.projectsApiUrl);
  }

  addProject(projectData: any): Observable<any> {
    return this.http.post(this.addProjectApiUrl, projectData);
  }

  deleteProject(projectId: number): Observable<any> {
    const deleteUrl = `${this.projectsApiUrl}/${projectId}`;
    return this.http.delete(deleteUrl);
  }

  getProjectById(id: number): Observable<any> {
    const apiUrl = `${this.projectsApiUrl}/${id}`;
    return this.http.get(apiUrl);
  }

  updateProject(projectId: number, projectData: any): Observable<any> {
    const apiUrl = `${this.projectsApiUrl}/${projectId}`;
    return this.http.put(apiUrl, projectData);
  }
}
