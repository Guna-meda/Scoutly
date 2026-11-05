import { styleguideSchema } from './schema';

/** Copy for the dev-only /styleguide route. Not product copy. */
export const styleguide = styleguideSchema.parse({
  title: 'Styleguide',
  intro: 'Every primitive in every state. Development only.',
  sections: {
    type: 'Typography',
    buttons: 'Buttons',
    pills: 'Pills and labels',
    icons: 'Icons and mark',
    layout: 'Layout',
    shell: 'Shell',
    join: 'Join target',
    device: 'Device',
    deviceDesktop: 'Desktop size, three screens',
    devicePhone: 'Phone size, three screens',
    deviceStack: 'Screen stack with a beat control',
    beatPrefix: 'Beat',
  },
  sample: 'Sample',
  buttonLabels: {
    primary: 'Primary',
    secondary: 'Secondary',
    disabled: 'Disabled',
    loading: 'Loading',
    link: 'As link',
  },
  fitLabels: { strong: 'Strong fit', good: 'Good fit', stretch: 'Stretch' },
  typeSamples: {
    display: 'Display sample',
    h2: 'Heading two sample',
    h3: 'Heading three sample',
    bodyL: 'Body large sample text for lead paragraphs.',
    body: 'Body sample text used for default paragraphs across the site.',
    ui: 'UI sample',
    label: 'Label sample',
    muted: 'Caption in the muted ink colour.',
  },
  joinTarget: 'The floating pill slides away while this section is on screen.',
});
