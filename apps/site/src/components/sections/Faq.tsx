'use client';

import { useId, useState } from 'react';
import { faq } from '@content/en';
import { Icon } from '../ui/Icon';

/** Accordion: real buttons with aria-expanded, answer opens via grid-template-rows 0fr to 1fr. */
export function FaqList() {
  const id = useId();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="faq-list">
      {faq.items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.q} className="faq-row" data-open={isOpen}>
            <h3 className="faq-q">
              <button
                type="button"
                className="faq-btn"
                aria-expanded={isOpen}
                aria-controls={`${id}-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <span className="faq-plus" aria-hidden="true">
                  <Icon name="plus" size={22} />
                </span>
              </button>
            </h3>
            <div
              id={`${id}-${i}`}
              className="faq-panel"
              role="region"
              aria-label={item.q}
              inert={!isOpen}
            >
              <div className="faq-panel-inner">
                <p>{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
