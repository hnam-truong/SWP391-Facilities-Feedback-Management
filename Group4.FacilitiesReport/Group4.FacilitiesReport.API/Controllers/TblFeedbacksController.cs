using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Group4.FacilitiesReport.DTO.Models;

namespace Group4.FacilitiesReport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TblFeedbacksController : ControllerBase
    {
        private readonly FacilitiesFeedbackManagement_SWP391Context _context;

        public TblFeedbacksController(FacilitiesFeedbackManagement_SWP391Context context)
        {
            _context = context;
        }

        // GET: api/TblFeedbacks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TblFeedback>>> GetTblFeedbacks()
        {
          if (_context.TblFeedbacks == null)
          {
              return NotFound();
          }
            return await _context.TblFeedbacks.ToListAsync();
        }

        // GET: api/TblFeedbacks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TblFeedback>> GetTblFeedback(Guid id)
        {
          if (_context.TblFeedbacks == null)
          {
              return NotFound();
          }
            var tblFeedback = await _context.TblFeedbacks.FindAsync(id);

            if (tblFeedback == null)
            {
                return NotFound();
            }

            return tblFeedback;
        }

        // PUT: api/TblFeedbacks/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTblFeedback(Guid id, TblFeedback tblFeedback)
        {
            if (id != tblFeedback.FeedbackId)
            {
                return BadRequest();
            }

            _context.Entry(tblFeedback).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TblFeedbackExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/TblFeedbacks
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TblFeedback>> PostTblFeedback(TblFeedback tblFeedback)
        {
          if (_context.TblFeedbacks == null)
          {
              return Problem("Entity set 'FacilitiesFeedbackManagement_SWP391Context.TblFeedbacks'  is null.");
          }
            _context.TblFeedbacks.Add(tblFeedback);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTblFeedback", new { id = tblFeedback.FeedbackId }, tblFeedback);
        }

        // DELETE: api/TblFeedbacks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTblFeedback(Guid id)
        {
            if (_context.TblFeedbacks == null)
            {
                return NotFound();
            }
            var tblFeedback = await _context.TblFeedbacks.FindAsync(id);
            if (tblFeedback == null)
            {
                return NotFound();
            }

            _context.TblFeedbacks.Remove(tblFeedback);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TblFeedbackExists(Guid id)
        {
            return (_context.TblFeedbacks?.Any(e => e.FeedbackId == id)).GetValueOrDefault();
        }
    }
}
