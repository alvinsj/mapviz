import { Container, Field } from '@grafana/ui'
import { Link } from 'react-router-dom'

const files = import.meta.glob('../../public/layers/*.geojson', {
  as: 'raw',
  eager: true,
})
const fileUrls = Object.keys(files).map((key) => [
  key.replace('../../public/layers/', ''),
  key.replace('../../public', ''),
])

const AvailableData = () => {
  return (
    <Container padding="md">
      <Field
        label="Preload geojson files"
        description="Click on a file to open it."
      >
        <ol>
          {fileUrls.map(([fileName, url]) => (
            <li key={fileName}>
              <Link to={'/'} state={{ fromAvailableData: true, url: url }}>
                {fileName}
              </Link>
            </li>
          ))}
        </ol>
      </Field>
    </Container>
  )
}

export default AvailableData
