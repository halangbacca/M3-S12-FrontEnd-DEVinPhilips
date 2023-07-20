import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/shared/models/Patient';
import { AppointmentService } from 'src/app/shared/services/appointment/appointment.service';
import { ExamService } from 'src/app/shared/services/exam/exam.service';
import { ExerciseService } from 'src/app/shared/services/exercise/exercise.service';
import { PatientService } from 'src/app/shared/services/patient/patient.service';
declare var google: any;

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit {
  patients = [] as Patient[];
  filteredPatients = [] as Patient[];

  // Zerar os valores após os outros endpoints serem inseridos
  qtPatients: number = 100;
  qtAppointments: number = 200;
  qtExams: number = 300;
  qtDrugs: number = 400;
  qtDiets: number = 500;
  qtExercises: number = 600;

  constructor(
    private patientService: PatientService,
    private examService: ExamService,
    private exerciseService: ExerciseService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.patientService.getAllPatient().subscribe((patient) => {
      this.patients = patient;
      this.filteredPatients = patient;
      this.qtPatients = patient.length;

      // Remover essa linha após os outros endpoints estarem inseridos
      this.qtPatients = 100;
    });

    this.examService.getAllExam().subscribe((exam) => {
      this.qtExams = exam.length;
    });

    this.exerciseService.getExercise().subscribe((exercise) => {
      this.qtExercises = exercise.length;

      // Remover essa linha após os outros endpoints estarem inseridos
      this.qtExercises = 600;
    });

    this.appointmentService.getAllConsult().subscribe((appointment) => {
      this.qtAppointments = appointment.length;
    });

    google.charts.load('current', { packages: ['bar'] });
    google.charts.setOnLoadCallback(() => {
      var data = google.visualization.arrayToDataTable([
        [
          '',
          'Pacientes',
          'Consultas',
          'Exames',
          'Medicamentos',
          'Dietas',
          'Exercícios',
        ],
        [
          'Estatísticas',
          this.qtPatients,
          this.qtAppointments,
          this.qtExams,
          this.qtDrugs,
          this.qtDiets,
          this.qtExercises,
        ],
      ]);

      var options = {
        chart: {},
        bars: 'vertical',
      };

      var chart = new google.charts.Bar(
        document.getElementById('barchart_material')
      );

      chart.draw(data, google.charts.Bar.convertOptions(options));
    });
  }

  searchPatient(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    this.filteredPatients = this.patients.filter((data) => {
      return (
        data.nome.toLowerCase().includes(value) ||
        data.cpf.toLowerCase().includes(value) ||
        data.email.toLowerCase().includes(value) ||
        data.telefone.toLowerCase().includes(value)
      );
    });
  }

  // Implementar a pesquisa de usuários após o endpoint user ser inserido
  searchUser(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    this.filteredPatients = this.patients.filter((data) => {
      return (
        data.nome.toLowerCase().includes(value) ||
        data.cpf.toLowerCase().includes(value) ||
        data.email.toLowerCase().includes(value) ||
        data.telefone.toLowerCase().includes(value)
      );
    });
  }
}
