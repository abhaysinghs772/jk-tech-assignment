import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entities/document.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(DocumentEntity, 'sqlDbConnection')
    private readonly DocRepository: Repository<DocumentEntity>,

    private userService: UserService,
  ) {}

  async create(documentBody: {title: string; filePath: string, uploadedBy: string}) {
    const { title, filePath: path, uploadedBy } = documentBody;
    
    const user = await this.userService.findOne(uploadedBy);
    if (!user) throw new NotFoundException("user doesn't exist")
    
    const doc = new DocumentEntity();
    doc.title = title;
    doc.path = path;
    doc.uploaded_by = user;

    return this.DocRepository.save(doc);
  }

  async findAll() {
    this.DocRepository.find();
  }

  async findById(id: string) {
    return this.DocRepository.findOne({where: {id: id}});
  }

  async update(id: string, updateDocBody: any){
    return this.DocRepository.update(id, updateDocBody);
  }

  async delete(id: string){
    return this.DocRepository.delete(id)
  }
}
