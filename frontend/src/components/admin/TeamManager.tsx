import { motion } from 'framer-motion'

interface TeamMember {
  id: number
  name: string
  position: string
  icon: string
  bio: string
  image_url?: string
  skills?: string
}

interface TeamManagerProps {
  teamData: TeamMember[]
  onEdit: (item: any) => void
  onDelete: (id: number) => void
}

const TeamManager: React.FC<TeamManagerProps> = ({ teamData, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teamData.map((member, index) => (
        <motion.div
          key={member.id}
          className="bg-magnolia/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-dun/20 hover:shadow-2xl transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <div className="flex items-start gap-4 mb-4">
            {/* Profile Image */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-dun/20 to-walnut/20 flex-shrink-0 border-2 border-dun/40">
              {member.image_url ? (
                <img 
                  src={member.image_url} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  {member.icon || '👤'}
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex-1" />
            <div className="flex gap-2">
              <motion.button
                onClick={() => onEdit(member)}
                className="p-2 text-walnut hover:bg-dun/30 rounded-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Edit member"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </motion.button>
              <motion.button
                onClick={() => onDelete(member.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Delete member"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </motion.button>
            </div>
          </div>
          <h3 className="text-xl font-bold text-vandyke mb-1">{member.name}</h3>
          <p className="text-walnut text-sm mb-3">{member.position}</p>
          <p className="text-sm text-battleshipgray leading-relaxed">{member.bio}</p>
        </motion.div>
      ))}
      
      {teamData.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <p className="text-battleshipgray text-lg">No team members yet. Click "Add New Member" to get started!</p>
        </div>
      )}
    </div>
  )
}

export default TeamManager
