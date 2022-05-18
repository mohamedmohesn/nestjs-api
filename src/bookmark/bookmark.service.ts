import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) { }

    async createBookmark(userid: number, dto: CreateBookmarkDto) {

        const bookmark = await this.prisma.bookmark.create({
            data:{
                userid,
                ...dto
            }
        })
        return bookmark
    }

    async getBookmark(userid: number) {
        return this.prisma.bookmark.findMany({
            where: {
                userid
            }
        })
    }

    async getBookmarkByID(userid: number, bookmarkid: number) {
        return this.prisma.bookmark.findFirst({
            where: {
                id:bookmarkid,
                userid
            }
        })
     }

    async editBookmark(userid: number, bookmarkid: number, dto: EditBookmarkDto) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkid,
            }
        });
        if (!bookmark || bookmark.userid !== userid) {
            throw new ForbiddenException("Access to resources denied");
            
        }
        return this.prisma.bookmark.update({
            where: {
                id: bookmarkid,
            },
            data:{
                ...dto
            }
        })
     }

    async deleteBookmark(userid: number, bookmarkid: number) { 
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkid,
            }
        });
        if (!bookmark || bookmark.userid !== userid) {
            throw new ForbiddenException("Access to resources denied");
            
        }
        return this.prisma.bookmark.delete({
            where:{
                id:bookmarkid
            }
        })
    }

}