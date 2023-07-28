import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Log } from 'src/app/shared/models/Log';
import { LogService } from 'src/app/shared/services/logs/log.service';

@Component({
  selector: 'app-list-logs',
  templateUrl: './list-logs.component.html',
  styleUrls: ['./list-logs.component.scss'],
})
export class ListLogsComponent implements OnInit {
  logs = [] as Log[];
  filteredLogs = [] as Log[];

  displayedColumns: string[] = [
    'id',
    'tablink',
    'codlink',
    'regatual',
    'reganterior',
    'dtaocorrencia',
    'usuario',
    'tipo',
  ];

  constructor(
    public dialogRef: MatDialogRef<ListLogsComponent>,
    private logService: LogService,
    @Inject(MAT_DIALOG_DATA) public data: Log
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.logService
      .getLogByCodLinkAndTabLink(this.data.codLink, this.data.tabLink)
      .subscribe((log) => {
        this.logs = log;
        this.filteredLogs = log;
      });
  }

  searchLog(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    this.filteredLogs = this.logs.filter((data) => {
      return (
        data.id.toString().includes(value) ||
        data.codLink.toString().includes(value) ||
        data.tabLink.toLowerCase().includes(value) ||
        data.tipoOcorrencia.toLowerCase().includes(value) ||
        data.usuario.toLowerCase().includes(value) ||
        data.dtaOcorrencia.includes(value)
      );
    });
  }
}
