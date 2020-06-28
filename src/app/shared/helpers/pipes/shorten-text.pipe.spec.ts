import { ShortenTextPipe } from './shorten-text.pipe';

describe('ShortLongTextPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenTextPipe();
    expect(pipe).toBeTruthy();
  });
});
