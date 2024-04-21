-- CreateTable
CREATE TABLE "FilContent" (
    "id" SERIAL NOT NULL,
    "filid" INTEGER NOT NULL,
    "filurl" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "opdateringsdato" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FilContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FilContent" ADD CONSTRAINT "FilContent_filid_fkey" FOREIGN KEY ("filid") REFERENCES "fil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
