import { Bubble } from './Bubble';

type Props = {
  header: string;
  greeting: string;
  paragraphs: readonly string[];
  signoff: string;
};

/** The email draft: greeting, short paragraphs, sign-off, as real paragraphs inside an article. */
export function DraftBubble({ header, greeting, paragraphs, signoff }: Props) {
  return (
    <Bubble wide>
      <article className="draft">
        <p className="caption">{header}</p>
        <div className="draft-body">
          <p>{greeting}</p>
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
          <p>{signoff}</p>
        </div>
      </article>
    </Bubble>
  );
}
