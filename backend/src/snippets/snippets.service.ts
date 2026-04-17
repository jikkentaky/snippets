import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Snippet, SnippetDocument } from './snippet.schema.js';
import { CreateSnippetDto } from './dto/create-snippet.dto.js';
import { UpdateSnippetDto } from './dto/update-snippet.dto.js';

interface FindAllQuery {
  page: number;
  limit: number;
  q?: string;
  tag?: string;
}

@Injectable()
export class SnippetsService {
  constructor(@InjectModel(Snippet.name) private snippetModel: Model<SnippetDocument>) {}

  async findAll({ page, limit, q, tag }: FindAllQuery) {
    const filter: Record<string, unknown> = {};

    if (q) filter.$text = { $search: q };
    if (tag) filter.tags = tag;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.snippetModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.snippetModel.countDocuments(filter).exec(),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  private assertValidId(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException(`Invalid id: ${id}`);
  }

  async findOne(id: string) {
    this.assertValidId(id);
    const snippet = await this.snippetModel.findById(id).exec();
    if (!snippet) throw new NotFoundException(`Snippet ${id} not found`);
    return snippet;
  }

  async create(dto: CreateSnippetDto) {
    return this.snippetModel.create(dto);
  }

  async update(id: string, dto: UpdateSnippetDto) {
    this.assertValidId(id);
    const snippet = await this.snippetModel.findByIdAndUpdate(id, dto, { returnDocument: 'after' }).exec();
    if (!snippet) throw new NotFoundException(`Snippet ${id} not found`);
    return snippet;
  }

  async remove(id: string) {
    this.assertValidId(id);
    const snippet = await this.snippetModel.findByIdAndDelete(id).exec();
    if (!snippet) throw new NotFoundException(`Snippet ${id} not found`);
    return snippet;
  }
}
