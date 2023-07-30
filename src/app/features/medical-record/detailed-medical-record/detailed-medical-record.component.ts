import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Patient } from 'src/app/shared/models/Patient';
import { AppointmentService } from 'src/app/shared/services/appointment/appointment.service';
import { DietService } from 'src/app/shared/services/diet/diet.service';
import { DrugService } from 'src/app/shared/services/drug/drug.service';
import { ExamService } from 'src/app/shared/services/exam/exam.service';
import { ExerciseService } from 'src/app/shared/services/exercise/exercise.service';
import { PatientService } from 'src/app/shared/services/patient/patient.service';

@Component({
  selector: 'app-detailed-medical-record',
  templateUrl: './detailed-medical-record.component.html',
  styleUrls: ['./detailed-medical-record.component.scss'],
})
export class DetailedMedicalRecordComponent implements OnInit {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isLinear = false;

  patient = {} as Patient;

  appointments = [] as any[];
  exams = [] as any[];
  drugs = [] as any[];
  diets = [] as any[];
  exercises = [] as any[];

  displayedAppointmentColumns: string[] = [
    'motivo',
    'data',
    'hora',
    'problema',
    'medicacao',
    'precaucao',
    'editar',
  ];

  displayedExamColumns: string[] = [
    'descricao',
    'tipo',
    'laboratorio',
    'data',
    'hora',
    'resultado',
    'anexo',
    'editar',
  ];

  displayedDrugColumns: string[] = [
    'nome',
    'data',
    'tipo',
    'quantidade',
    'unidade',
    'observacoes',
    'editar',
  ];

  displayedDietColumns: string[] = [
    'nome',
    'data',
    'tipo',
    'descricao',
    'editar',
  ];

  displayedExerciseColumns: string[] = [
    'nome',
    'data',
    'tipo',
    'qtdSemana',
    'descricao',
    'editar',
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private examService: ExamService,
    private drugService: DrugService,
    private dietService: DietService,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit() {
    const patientId = this.route.snapshot.paramMap.get('id')!;

    this.patientService
      .getPatientById(parseInt(patientId))
      .subscribe((patient) => {
        this.patient = patient;
      });

    this.appointmentService
      .getAppointmentByPatientId(parseInt(patientId))
      .subscribe((appointment) => {
        this.appointments = appointment;
      });

    this.examService
      .getExamByPatientId(parseInt(patientId))
      .subscribe((exam) => {
        this.exams = exam;
      });

    this.drugService
      .getDrugByPatientId(parseInt(patientId))
      .subscribe((drug) => {
        this.drugs = drug;
      });

    this.dietService
      .getDietByPatientId(parseInt(patientId))
      .subscribe((diet) => {
        this.diets = diet;
      });

    this.exerciseService
      .getExerciseByPatientId(parseInt(patientId))
      .subscribe((exercise) => {
        this.exercises = exercise;
      });
  }
}
