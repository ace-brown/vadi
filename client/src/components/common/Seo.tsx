// Page title and description. React 19 moves <title> and <meta> into <head>.
export default function Seo({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <title>{`${title} | Vadi`}</title>
      {description && <meta name="description" content={description} />}
    </>
  );
}
