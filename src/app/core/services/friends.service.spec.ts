import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FriendsService } from './friends.service';
import { Friend, BaseResponseListDto } from '../models/friend.model';
import { environment } from 'src/environments/environment';

describe('FriendsService', () => {
  let service: FriendsService;
  let httpMock: HttpTestingController;
  const apiBaseUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FriendsService]
    });

    service = TestBed.inject(FriendsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFriends', () => {
    it('should fetch friends list and extract data from response', (done) => {
      const mockFriends: Friend[] = [
        { id: '1', name: 'Juan', gender: 'M' },
        { id: '2', name: 'María', gender: 'F' }
      ];

      const mockResponse: BaseResponseListDto<Friend> = {
        statusCode: 200,
        message: 'Success',
        data: mockFriends
      };

      service.getFriends().subscribe((result) => {
        expect(result).toEqual(mockFriends);
        expect(result.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/api/friends`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return empty array when response data is empty', (done) => {
      const mockResponse: BaseResponseListDto<Friend> = {
        statusCode: 200,
        message: 'Success',
        data: []
      };

      service.getFriends().subscribe((result) => {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/api/friends`);
      req.flush(mockResponse);
    });

    it('should handle error response', (done) => {
      service.getFriends().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/api/friends`);
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getFriendById', () => {
    it('should fetch a single friend by id', (done) => {
      const mockFriend: Friend = { id: '1', name: 'Juan', gender: 'M' };
      const friendId = '1';

      service.getFriendById(friendId).subscribe((result) => {
        expect(result).toEqual(mockFriend);
        expect(result.id).toBe('1');
        done();
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/api/friends/${friendId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockFriend);
    });

    it('should handle 404 error for non-existent friend', (done) => {
      const friendId = 'nonexistent';

      service.getFriendById(friendId).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiBaseUrl}/api/friends/${friendId}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
