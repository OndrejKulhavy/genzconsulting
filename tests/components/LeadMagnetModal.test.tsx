import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LeadMagnetModal } from '@/components/ui/LeadMagnetModal'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('LeadMagnetModal', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('shows email input when open', () => {
    render(<LeadMagnetModal isOpen={true} onClose={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    render(<LeadMagnetModal isOpen={true} onClose={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'bad-email')
    fireEvent.click(screen.getByRole('button', { name: /chci|send|submit/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('shows download link on successful submission', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ downloadUrl: '/downloads/legit-check.pdf' }),
    })
    render(<LeadMagnetModal isOpen={true} onClose={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com')
    fireEvent.click(screen.getByRole('button', { name: /chci|send|submit/i }))
    await waitFor(() => {
      expect(screen.getByRole('link', { name: /stáhnout|download/i })).toBeInTheDocument()
    })
  })

  it('shows error message when API fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) })
    render(<LeadMagnetModal isOpen={true} onClose={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'test@example.com')
    fireEvent.click(screen.getByRole('button', { name: /chci|send|submit/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
