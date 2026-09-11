import { useState } from 'react';
import { classQuestions, examNotes } from '../data/school';
import { Card, PageHeader, Badge, filterBy } from '../components/ui';

export function SchoolPage() {
  const [q, setQ] = useState('');
  const [examsOnly, setExamsOnly] = useState(false);
  let list = filterBy(classQuestions, q, (c) => `${c.date} ${c.question} ${c.answer} ${c.exam ?? ''}`);
  if (examsOnly) list = list.filter((c) => c.exam);

  return (
    <>
      <PageHeader
        eyebrow="Gekkoukan High"
        title="Class & Exam Answers"
        lede="Every classroom question and exam answer in date order. Correct answers raise Academics (and Charm when classmates are impressed); exam results depend on these answers plus your Academics rank."
      />

      <Card>
        <ul className="small muted" style={{ margin: 0 }}>
          {examNotes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </Card>

      <div className="controls" style={{ marginTop: '1rem' }}>
        <input className="input" placeholder="Search by date, question or answer…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className={`chip ${examsOnly ? 'active' : ''}`} onClick={() => setExamsOnly((v) => !v)}>
          Exams only
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Question</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={`${c.date}-${c.answer}`}>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <strong>{c.date}</strong>
                  {c.exam && (
                    <div>
                      <Badge tone="gold">{c.exam}</Badge>
                    </div>
                  )}
                </td>
                <td className="small">{c.question}</td>
                <td>
                  <strong style={{ color: 'var(--ok)' }}>{c.answer}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
