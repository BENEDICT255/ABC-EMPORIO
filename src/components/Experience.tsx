import { content } from '../config/content';
import { eventConfig } from '../config/event';
import { Picture } from './ui';
import './Experience.css';

export function Experience() {
  const exp = content.experience;
  const activeHighlights = exp.highlights.filter((item) => {
    if (item.requires === 'teamPresenceConfirmed') {
      return eventConfig.teamPresenceConfirmed;
    }
    return true;
  });

  return (
    <section className="section section--dark experience" id="experience" aria-labelledby="experience-heading">
      <div className="container">
        <header className="experience__header reveal">
          <p className="label">{exp.label}</p>
          <h2 id="experience-heading" className="h2 experience__heading">{exp.heading}</h2>
        </header>

        <div className="experience__items">
          {activeHighlights.map((item, index) => {
            const num = String(index + 1).padStart(2, '0');
            const isReverse = index % 2 === 1;

            return (
              <article
                key={item.title}
                className={`experience-row ${isReverse ? 'experience-row--reverse' : ''} reveal`}
              >
                <div className="experience-row__media media">
                  <Picture
                    img={item.image}
                    sizes="(max-width: 767px) 100vw, 55vw"
                    className="experience-row__picture"
                  />
                  <div className="experience-row__index">({num})</div>
                </div>

                <div className="experience-row__content">
                  <span className="experience-row__tag">
                    Highlight {num}
                  </span>
                  <h3 className="h3 experience-row__title">{item.title}</h3>
                  <p className="experience-row__text">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        {eventConfig.featuredProducts.length > 0 && (
          <div className="experience__featured reveal">
            <span className="label">{exp.featuredLabel}</span>
            <ul className="experience__featured-list">
              {eventConfig.featuredProducts.map((p) => (
                <li key={p} className="experience__featured-item">{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
