import TopicCloud from "@/components/TopicCloud"

const TopicCloudPage = () => {
  return (
    <div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-[520px]">
          <TopicCloud />
        </div>
      </div>
    </div>
  )
}

export default TopicCloudPage
