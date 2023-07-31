import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/shared/models/Patient';
import { User } from 'src/app/shared/models/User';
import { AppointmentService } from 'src/app/shared/services/appointment/appointment.service';
import { DietService } from 'src/app/shared/services/diet/diet.service';
import { DrugService } from 'src/app/shared/services/drug/drug.service';
import { ExamService } from 'src/app/shared/services/exam/exam.service';
import { ExerciseService } from 'src/app/shared/services/exercise/exercise.service';
import { PatientService } from 'src/app/shared/services/patient/patient.service';
import { UserService } from 'src/app/shared/services/user/user.service';
declare var google: any;

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit {
  patients = [] as Patient[];
  users = [] as User[];

  filteredPatients = [] as Patient[];
  filteredUsers = [] as User[];

  qtPatients: number = 0;
  qtAppointments: number = 0;
  qtExams: number = 0;
  qtDrugs: number = 0;
  qtDiets: number = 0;
  qtExercises: number = 0;

  constructor(
    private patientService: PatientService,
    private userService: UserService,
    private examService: ExamService,
    private drugService: DrugService,
    private dietService: DietService,
    private exerciseService: ExerciseService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.patientService.getAllPatient().subscribe((patient) => {
      this.patients = patient;
      this.filteredPatients = patient;
      this.qtPatients = patient.length;
    });

    this.userService.getUser().subscribe((user) => {
      this.users = user;
      this.filteredUsers = user;
    });

    this.examService.getAllExam().subscribe((exam) => {
      this.qtExams = exam.length;
    });

    this.exerciseService.getExercise().subscribe((exercise) => {
      this.qtExercises = exercise.length;
    });

    this.appointmentService.getAllAppointments().subscribe(appointment=>{
      this.qtAppointments = appointment.length;
    });
    
    this.drugService.getDrug().subscribe((drug) => {
      this.qtDrugs = drug.length;
    });

    this.dietService.getDiet().subscribe((diet) => {
      this.qtDiets = diet.length;
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
        data.nome.toLowerCase().includes(value.toLowerCase()) ||
        data.cpf.toLowerCase().includes(value.toLowerCase()) ||
        data.email.toLowerCase().includes(value.toLowerCase()) ||
        data.telefone.toLowerCase().includes(value.toLowerCase())
      );
    });
  }

  searchUser(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    this.filteredUsers = this.users.filter((data) => {
      return (
        data.nome.toLowerCase().includes(value.toLowerCase()) ||
        data.cpf.toLowerCase().includes(value.toLowerCase()) ||
        data.email.toLowerCase().includes(value.toLowerCase()) ||
        data.telefone.toLowerCase().includes(value.toLowerCase())
      );
    });
  }
}
