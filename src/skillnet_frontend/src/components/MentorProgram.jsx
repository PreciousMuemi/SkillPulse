import React, { useState } from 'react'

const MentorProgram = () => {
  const [showApplication, setShowApplication] = useState(false)
  const [formData, setFormData] = useState({
    expertise: '',
    yearsExperience: '',
    availability: '',
    timezone: '',
    teachingStyle: '',
    bio: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    setShowApplication(false)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Mentor Program</h2>
        <button 
          onClick={() => setShowApplication(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply Now
        </button>
      </div>

      {showApplication && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded">
          <div>
            <label className="block mb-2">Expertise</label>
            <input
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Years of Experience</label>
            <input
              type="number"
              name="yearsExperience"
              value={formData.yearsExperience}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full border p-2 rounded h-24"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowApplication(false)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default MentorProgram
