# 👨‍⚕️ Doctor's Quick Reference Guide

## 🚀 Getting Started (5 seconds)

1. **Open Dashboard**: Navigate to the provided URL
2. **Scan Queue**: Red-flag patients appear at the top with red borders
3. **Take Action**: Click buttons to manage patients

---

## 🎯 Main Actions

### View Patient Details
```
Click: "View Details" button
→ Opens patient detail workspace
→ Review demographics, complaints, AI summary, notes, and additional details
```

### Start Consultation
```
Click: "Start" button (on waiting patients)
→ Status changes to "In Progress"
→ Patient stays in queue for reference
```

### Complete Consultation
```
Click: "Complete" button (on in-progress patients)
→ Status changes to "Completed"
→ Patient moves to bottom of queue
```

### Attend Red-Flag Immediately
```
Click: "Attend First" button (on red-flag patients)
→ Patient moves to #1 position
→ Status changes to "In Progress"
→ Visual priority indicator appears
```

### Remove Red-Flag Status
```
Click: "Mark Not Urgent" button
→ Red-flag indicator removed
→ Patient returns to normal queue position
→ Sorted by arrival time
```

---

## 📊 Understanding the Interface

### Color Coding

| Color | Meaning |
|-------|---------|
| 🔴 Red Border | Red-flag patient - requires immediate attention |
| 🟡 Yellow Badge | Status: Waiting |
| 🔵 Blue Badge | Status: In Progress |
| 🟢 Green Badge | Status: Completed |
| 🟣 Purple Ring | Manually prioritized patient |

### Queue Position

- **#1-3**: Top priority (red-flags and in-progress)
- **#4+**: Normal queue (sorted by arrival time)
- **Bottom**: Completed patients

### Patient Queue Row Information

```
┌─────────────────────────────────────────────────────────────────────┐
│ Queue # │ RN │ Age │ Gender │ Arrival │ Status │ Actions          │
│ Q001    │ ...│ ... │ ...    │ ...     │ ...    │ View / Priority  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ⏱️ Auto-Refresh

### Default Behavior
- ✅ Auto-refresh: **ON** (every 30 seconds)
- 🔄 New patients appear automatically
- 📊 Statistics update in real-time

### Manual Control
```
Toggle: Click "Auto-refresh ON/OFF" in header
Refresh Now: Click "Refresh" button
Last Update: Shows "Last updated: X minutes ago"
```

---

## 🚨 Red-Flag Protocol

### What is a Red-Flag?
Red-flag patients have been identified by the AI system as requiring immediate clinical attention based on their submitted history.

### When You See a Red-Flag:

1. **Review Immediately**
   - Red border catches your attention
   - Patient auto-positioned at top
   - Check complaints and AI summary

2. **Assess Urgency**
   - If urgent: Click "Attend First"
   - If not urgent: Click "Mark Not Urgent"
   - Patient reorders accordingly

3. **Document Decision**
   - Update status in patient details as consultation progresses
   - Use AI summary editor if clarification is needed before handoff

---

## 📈 Queue Statistics (Top Bar)

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total: 12    │ Waiting: 8   │ Progress: 3  │ Red Flags: 1 │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

**Use this to:**
- Quickly assess workload
- Identify bottlenecks
- Monitor red-flag frequency

---

## 🔍 Finding a Specific Patient

- Scroll through the queue table
- Use browser search (Ctrl+F / Cmd+F)
- Search by RN or visible demographic fields

---

## ⚠️ Error Handling

### "Network Error"
```
Cause: API connection lost
Action: Click "Retry" button
Fallback: Last successful data shown with warning
```

### "No Patients in Queue"
```
Cause: No submissions in system
Action: Wait for new patient arrivals
Info: Auto-refresh continues in background
```

### "Partial Data"
```
Cause: Some records malformed
Action: None required - system skips invalid records
Info: Check with IT if persistent
```

---

## ⌨️ Keyboard Notes

- Standard browser/OS keyboard behavior is supported.
- Dedicated application keyboard shortcuts are not currently implemented.

---

## 💡 Pro Tips

### Efficiency Tips
1. **Keep auto-refresh ON** during busy periods
2. **Use color coding** for quick scanning
3. **Check statistics first** to assess workload
4. **Prioritize red-flags** but verify urgency

### Clinical Best Practices
1. **Review AI summary** before attending
2. **Update status promptly** for accurate queue
3. **Mark false red-flags** to improve AI accuracy
4. **Complete patients** to maintain clean queue

### Workflow Optimization
```
Morning Shift Start:
1. Review queue statistics
2. Identify red-flags
3. Assess waiting times
4. Start with longest waits or red-flags

During Shift:
1. Monitor queue every 5-10 minutes
2. Update patient status immediately
3. Use "Attend First" strategically
4. Keep queue flowing

Shift Handover:
1. Review all "In Progress" patients
2. Note any red-flags
3. Brief incoming doctor on special cases
```

---

## 🆘 Common Questions

**Q: Why isn't my status update showing?**  
A: Changes are saved locally and will sync on next refresh. Check auto-refresh is enabled.

**Q: Can I reorder patients manually?**  
A: Currently only via "Attend First" for red-flags. Manual reordering coming in Phase 2.

**Q: What if I click "Attend First" by mistake?**  
A: Click "Mark Not Urgent" to return patient to normal position.

**Q: Can I see patient history?**  
A: Use "View Details" to open the full detail workspace, including complaints, AI summary, notes, and additional fields when available.

**Q: How do I print the queue?**  
A: Use browser print (Ctrl+P). Formatted print view coming in Phase 2.

**Q: Can multiple doctors use this simultaneously?**  
A: Yes! Each doctor sees the same queue. Status updates sync on refresh.

---

## 📞 Support Contacts

**Technical Issues**: IT Department  
**Clinical Questions**: ED Supervisor  
**Feature Requests**: Healthcare Systems Team

---

## 🔄 Change Log

**v1.0.0** (January 2026)
- ✅ Initial release
- ✅ Real-time queue display
- ✅ Red-flag prioritization
- ✅ Auto-refresh (30s)
- ✅ Status management

**v1.1.0** (April 2026)
- ✅ Patient detail workspace
- ✅ AI summary edit and copy workflow
- ✅ Red-flag alert banner improvements

---

**Remember**: This tool is designed to **augment**, not replace, clinical judgment. Always use your professional expertise when making patient care decisions.

**Last Updated**: April 12, 2026  
**Version**: 1.1.0  
**For**: Emergency Department Doctors - Green Zone
