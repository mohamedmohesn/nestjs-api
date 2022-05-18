import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) { }

    @Post('create')
    createBookmark(@GetUser('id') userid: number, @Body() dto: CreateBookmarkDto) {
        return this.bookmarkService.createBookmark(userid,dto)
    }

    @Get('get')
    getBookmark(@GetUser('id') userid: number,) {
        return this.bookmarkService.getBookmark(userid)

    }

    @Get('ByID/:id')
    getBookmarkByID(@GetUser('id') userid: number, @Param('id', ParseIntPipe) bookmarkID: number) {
        return this.bookmarkService.getBookmarkByID(userid,bookmarkID)

    }

    @Patch('edit/:id')
    editBookmark(@GetUser('id') userid: number, @Param('id', ParseIntPipe) bookmarkID: number, @Body() dto: EditBookmarkDto) {
        return this.bookmarkService.editBookmark(userid,bookmarkID,dto)

    }
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('delete/:id')
    deleteBookmark(@GetUser('id') userid: number, @Param('id', ParseIntPipe) bookmarkID: number) {
        return this.bookmarkService.deleteBookmark(userid,bookmarkID)

    }
}
