import { brand } from '../config/brand';
import { content } from '../config/content';
import { Picture } from './ui';
import './Introduction.css';

export function Introduction() {
  const intro = content.introduction;

  return (
    <section className="section section--light intro" id="introduction" aria-labelledby="intro-heading">
      <div className="container">
        <div className="intro__grid">
          <div className="intro__text reveal">
            <p className="label">{intro.label}</p>
            <h2 id="intro-heading" className="h2 intro__heading">{intro.heading}</h2>
            <p className="lead intro__body">{intro.body}</p>
          </div>

          <div className="intro__visual reveal">
            <div className="media intro__media">
              <Picture
                img={brand.images.showroom}
                sizes="(max-width: 991px) 100vw, 50vw"
                className="intro__picture"
              />
            </div>
            <p className="intro__caption">
              ABC Emporio Showroom &mdash; curated sanitaryware, baths and architectural fittings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
