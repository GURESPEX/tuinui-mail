import React from "react";

import {
  clamp,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

const loveMessages: string[] = [
  "รักอ้วงที่สุดเลยยย ❤️",
  "สุขสันต์วันวาเลนไทน์ย้อนหลังนะค้าบบบ ❤️",
  "ขอให้เตงอยู่กับเค้าไปนาน ๆ เลยน้าาา ❤️",
  "เค้าจะเลี้ยงเตงให้พุงพลุ้ยไปเร้ยยย ❤️",
];

const Mail = () => {
  const [isMessageOpened, setIsMessageOpened] = React.useState(false);
  const [loveMessagesIndex, setLoveMessagesIndex] = React.useState(0);

  const dragOffsetY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const openerZIndex = useTransform(() => (rotateX.get() < 90 ? 3.01 : 1));

  useMotionValueEvent(rotateX, "change", (value) => {
    setIsMessageOpened(value >= 90);
  });

  const handleDrag = React.useCallback<
    Exclude<React.ComponentProps<typeof motion.div>["onDrag"], undefined>
  >(
    (_event, info) => {
      rotateX.set(clamp(0, 180, dragOffsetY.get() - info.offset.y));
    },
    [rotateX, dragOffsetY],
  );

  const handleDragEnd = React.useCallback<
    Exclude<React.ComponentProps<typeof motion.div>["onDragEnd"], undefined>
  >(() => {
    dragOffsetY.set(rotateX.get());
  }, [dragOffsetY, rotateX]);

  const messageVariants = React.useMemo<
    React.ComponentProps<typeof motion.div>["variants"]
  >(
    () => ({
      messageOpen: {
        scale: [0, 2],
        y: [50, -500, 0],
        zIndex: [2, 4, 4],
        transition: {
          scale: {
            duration: 1,
            ease: [0, 1, 1, 1],
          },
          y: {
            duration: 1,
            ease: [
              [0, 1, 1, 1],
              [1, 0, 0.5, 1],
            ],
          },
        },
      },
      messageClose: {
        scale: 2,
        y: "100vh",
        zIndex: 5,
        transition: {
          scale: {
            duration: 0.5,
            ease: [0.5, 0, 0, 1],
          },
          y: {
            duration: 0.5,
            ease: [0.5, 0, 0, 1],
          },
        },
      },
    }),
    [],
  );

  React.useEffect(() => {
    if (!isMessageOpened) return;
    setLoveMessagesIndex((prev) => (prev + 1) % loveMessages.length);
  }, [isMessageOpened]);

  return (
    <div className="relative w-lg bg-linear-0 from-slate-300 to-slate-100 aspect-video perspective-distant">
      <motion.div
        className="absolute inset-0 bg-white flex justify-center items-center hover:cursor-pointer"
        animate={isMessageOpened ? "messageOpen" : "messageClose"}
        variants={messageVariants}
      >
        <div className="absolute inset-0 flex justify-center items-center p-8 text-4xl text-center">
          {loveMessages[loveMessagesIndex]}
        </div>
        <div className="absolute inset-0 flex justify-end items-end p-4 text-sm italic opacity-25">
          จาก เจเจแฟนหมูน้อยแบม 😘
        </div>
      </motion.div>
      <div
        className="absolute inset-0 bg-slate-100 z-3"
        style={{
          clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)",
        }}
      />
      <motion.div
        drag="y"
        dragConstraints={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        dragElastic={0}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 bg-linear-0 from-slate-200 to-slate-100 hover:cursor-grab active:cursor-grabbing"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 20%, 50% 75%, 0 20%)",
          transformStyle: "preserve-3d",
          originY: 0,
          rotateX,
          zIndex: openerZIndex,
        }}
      />
    </div>
  );
};

export default Mail;
