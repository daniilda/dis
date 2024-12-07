import { observer } from "mobx-react-lite";
import { FC, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button, buttonVariants } from "../ui/button";
import { DatabaseIcon, Loader, Search, Upload } from "lucide-react";
import { cn } from "@/utils/cn";
import { supportedFileTypes, vm } from "@/stores/store";
import { Checkbox } from "../ui/checkbox";
import { formatDate } from "@/utils/format/date";
import { ScrollArea } from "../ui/scroll-area";
import { pluralize } from "@/utils/locale/pluralize";
import { IconInput } from "../ui/input";
import { useDebouncedEffect } from "@/utils/hooks/use-debounce";

export const DatabaseDrawer: FC<{
  isCollapsed: boolean;
}> = observer(({ isCollapsed }) => {
  const [search, setSearch] = useState("");
  const [filteredFiles, setFilteredFiles] = useState(vm.database);

  useDebouncedEffect(
    () =>
      setFilteredFiles(
        vm.database.filter((file) =>
          file.name.toLowerCase().includes(search.trim().toLowerCase()),
        ),
      ),
    [vm.database, search],
    500,
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="mb-3 sm:mb-2 min-h-11 sm:min-h-12 md:rounded-full md:mx-2">
          <DatabaseIcon />
          <span className={cn(isCollapsed && "sr-only")}>База данных</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[84vh] overflow-hidden flex flex-col h-full">
        <DrawerHeader>
          <DrawerTitle>
            База данных{" "}
            <span className="text-zinc-300">({filteredFiles.length})</span>
          </DrawerTitle>
          <DrawerDescription>
            Здесь вы можете посмотреть, удалить или добавить новые файлы в базу
            данных
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex items-center">
          <IconInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search />}
          />
        </div>
        <ScrollArea>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2 mx-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "flex items-center space-x-4 p-4 border rounded-lg relative overflow-hidden w-full",
                  file.selected && "border-primary",
                  file.isUploading && "opacity-50",
                )}
              >
                {file.isUploading ? (
                  <Loader className="animate-spin duration-spinner" />
                ) : (
                  <Checkbox
                    checked={file.selected}
                    onCheckedChange={() => (file.selected = !file.selected)}
                    className="before:absolute before:inset-0"
                  />
                )}
                <div className="flex-1 w-full overflow-hidden flex flex-col">
                  <div className="font-medium overflow-hidden flex-1 flex">
                    <span className="truncate">{file.name.split(".")[0]}.</span>
                    <span>{file.name.split(".")[1]}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {file.isUploading
                      ? "Загружается..."
                      : `Загружен ${formatDate(file.uploadDate, "ddMMyyyyHHmm")}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DrawerFooter className="flex sm:flex-row flex-col justify-end gap-2 flex-wrap w-full">
          <Button
            variant="destructive"
            onClick={() => vm.deleteFiles()}
            disabled={vm.selectedFiles.length === 0}
          >
            Удалить{" "}
            {vm.selectedFiles.length > 0 && (
              <>
                {vm.selectedFiles.length}{" "}
                {pluralize(vm.selectedFiles.length, [
                  "файл",
                  "файла",
                  "файлов",
                ])}
              </>
            )}
          </Button>
          <label
            className={cn(
              buttonVariants({ variant: "default" }),
              "relative cursor-pointer",
            )}
          >
            <input
              type="file"
              multiple
              accept={supportedFileTypes.join(",")}
              className="sr-only"
              onChange={(e) =>
                e.target.files && vm.uploadFiles(Array.from(e.target.files))
              }
            />
            <Upload />
            <span>Загрузить файлы</span>
          </label>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
});
