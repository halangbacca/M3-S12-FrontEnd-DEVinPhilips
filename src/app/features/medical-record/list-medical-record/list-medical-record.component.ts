import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/shared/models/Patient';
import { PatientService } from 'src/app/shared/services/patient/patient.service';

@Component({
  selector: 'app-list-medical-record',
  templateUrl: './list-medical-record.component.html',
  styleUrls: ['./list-medical-record.component.scss'],
})
export class ListMedicalRecordComponent implements OnInit {
  patients = [] as Patient[];
  filteredPatients = [] as Patient[];

  displayedColumns: string[] = [
    'id',
    'nome',
    'data-nascimento',
    'telefone',
    'email',
    'convenio',
    'ver-mais',
  ];

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.patientService.getAllPatient().subscribe((patient) => {
      this.patients = patient;
      this.filteredPatients = patient;
    });
  }

  searchPatient(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    this.filteredPatients = this.patients.filter((data) => {
      return (
        data.nome.toLowerCase().includes(value.toLowerCase()) ||
        data.id.toString().includes(value)
      );
    });
  }
}
