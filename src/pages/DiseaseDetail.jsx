import React from 'react'
import { useParams } from 'react-router-dom';

export default function DiseaseDetail() {
  const { id } = useParams();
  return (
    <div
    style={{
      display: "flex",
      justifyContent: "Center",
      alignItems: "Center",
      // height: "100vh",
    }}
  >
    <h1>Extracted DiseaseDetail {id}</h1>
  </div>
  )
}
