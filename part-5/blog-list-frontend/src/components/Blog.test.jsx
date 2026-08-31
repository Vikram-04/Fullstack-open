import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('render blog title and author only', () => {
  const user = { username: 'Jack-04', name: 'Jack' }
  const blog = {
    title: 'how-to-prepare-for-q4-planning',
    author: 'Daniel carnegie',
    url: 'https://www.dalecarnegie.com/blog/how-to-prep',
    likes: 3,
    user: user,
  }

  const { container } = render(<Blog blog={blog} user={user}></Blog>)
  console.log(container.innerHTML)
  screen.getByText(blog.title, { exact: false })
  screen.getByText(blog.author, { exact: false })
  expect(screen.getByText(blog.url, { exact: false })).not.toBeVisible()
  expect(screen.getByText('3', { exact: false })).not.toBeVisible()
})
test('url and likes are shown when button is clicked', async () => {
  const blogUser = { username: 'Jack-04', name: 'Jack' }
  const blog = {
    title: 'how-to-prepare-for-q4-planning',
    author: 'Daniel carnegie',
    url: 'https://www.dalecarnegie.com/blog/how-to-prep',
    likes: 3,
    user: blogUser,
  }

  render(<Blog blog={blog} user={blogUser}></Blog>)
  const user = userEvent.setup()
  await user.click(screen.getByText('show'))
  expect(screen.getByText(blog.url, { exact: false })).toBeVisible()
  expect(screen.getByText('3', { exact: false })).toBeVisible()
})

test('likes are recorded', async () => {
  const blogUser = { username: 'Jack-04', name: 'Jack' }
  const blog = {
    title: 'how-to-prepare-for-q4-planning',
    author: 'Daniel carnegie',
    url: 'https://www.dalecarnegie.com/blog/how-to-prep',
    likes: 3,
    user: blogUser,
  }
  const mockHandler = vi.fn()
  render(<Blog blog={blog} user={blogUser} likeBlog={mockHandler}></Blog>)
  const user = userEvent.setup()

  expect(screen.getByText('Like')).not.toBeVisible()
  await user.click(screen.getByText('show'))
  const likeButton = screen.getByText('Like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
