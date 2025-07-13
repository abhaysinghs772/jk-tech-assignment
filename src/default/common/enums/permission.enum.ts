export enum Permission {
  ManageUsers = 'manage:users',
  CreateDocument = 'create:document',
  ReadAnyDocument = 'read:any_document',
  UpdateAnyDocument = 'update:any_document',
  DeleteAnyDocument = 'delete:any_document',
  UpdateOwnDocument = 'update:own_document',
  DeleteOwnDocument = 'delete:own_document',
  UploadDocument = 'upload:document',
  TriggerIngestion = 'trigger:ingestion',
  ManageIngestionProcesses = 'manage:ingestion_processes',
  ViewIngestionStatus = 'view:ingestion_status',
}