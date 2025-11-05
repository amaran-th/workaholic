function LabelNode({ data }: { data: { value: string } }) {
  return (
    <div className="rounded-full bg-primary text-white w-28 h-8 flex justify-center items-center opacity-80">
      {data.value}
    </div>
  );
}

export default LabelNode;
